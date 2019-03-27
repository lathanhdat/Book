const express = require('express')
const UserPath = require('path').join(__dirname,'../models/users')
const auth = require('../middleware/auth')
const User = require(UserPath)
const router = new express.Router()

//User end point
router.post('/users',async(req,res)=>{
    const user = new User(req.body)
    try {
        const token = await user.generateToken()
        await user.save()
        res.status(201).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login',async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.account,req.body.password)
        const token = await user.generateToken()
        res.send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})
router.patch('/users/:id',async (req,res)=>{
    const updates = Object.keys(req.body)
    const _id = req.params.id;
    const allowedUpdate = ['name','email','password','age']
    const isValid = updates.every((update)=> allowedUpdate.includes(update))

    if(!isValid) return res.status(400).send({error: 'Invalid updates!'})
    try {
        const user = await User.findById(_id)
        updates.forEach((update)=> user[update]=req.body[update])
        await user.save()
        if(!user) return res.status(404).send()
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/:id',async (req,res)=>{
    const _id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(_id)
        if(!user) return res.status(404).send()
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
})

router.get('/users/all',async (req,res)=>{
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/users/:id',async (req,res)=>{
    const _id = req.params.id;
    try {
        const user = await User.findById(_id)
        if (!user) return res.status(404).send()
        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router