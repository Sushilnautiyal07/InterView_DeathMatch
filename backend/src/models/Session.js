import mongoose from 'mongoose';

const SessionSchema=new mongoose.Schema({

    problem:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        required:true
    },

    host:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    participants:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
    },
    status:{
        type:String,
        enum:['active','completed'],
        default:'active'
    },
    callId:{
        type:String,
        default:""
    },

} ,{timestamps:true});

const Session=mongoose.model('Session',SessionSchema);
export default Session;