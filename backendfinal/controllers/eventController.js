const Cours = require("../models/Cours");
const {Event} = require("../models/event.model"); 
const createEvent = function(req, res){
    const {title,coursId,coachId,event_date,onlinesession} = req.body;

    const new_event = new Event({
        title:title,
        cours:coursId,
        createdBy:coachId,
        event_date:event_date,
        onlinesession:onlinesession

    });

    new_event.save((error,event) =>{
        if(error){
            console.log(error);
            return res.status(500).json({error:"Error creating event"});
        }
        console.log("Event created:" , event);
        return res.status(201).json({ message: "Event created successfully" });
    })
}

const getEvent = async function(req, res){
    const event =  await Event.findById(req.params.id).populate(["cours","createdBy"]);
    if(event === undefined){
        return res.status(500).json({error:"Error finding event"});
    }
        return res.status(201).json({ message: event});
}

const getEventsForUser = async function(req, res) {
    console.log(req.body)
    const cours = await Cours.find({subscribers:req.body.userId}).exec();
    
    if(cours[0].subscribers.length ===0){
        return res.status(500).json({error:"No Cours"});
    }

    let totalEvents = [];

    for (const item of cours) {
        if(item.subscribers.length !==0){
           await Event.find({cours:item._id}).populate(['cours','createdBy']).exec().then((events) => {
                if(events.length !== 0){
                    totalEvents.push(...events)
                }
            })
            
        }
    }
    return res.status(200).json({ events: totalEvents})
};


const getEventsByCoach = async function(req, res) {
    console.log(req.body);
    const coachId = req.body.coachId;
    const cours = await Cours.find({ createdBy: coachId }).exec();
    
    if (cours.length === 0) {
        return res.status(500).json({ error: "No Cours" });
    }

    let totalEvents = [];

    for (const item of cours) {
        if (item.subscribers.length !== 0) {
            await Event.find({ cours: item._id, createdBy: coachId })
                .populate(['cours','createdBy'])
                .exec()
                .then((events) => {
                    if (events.length !== 0) {
                        totalEvents.push(...events)
                    }
                })
        }
    }
    return res.status(200).json({ events: totalEvents });
};


module.exports = {
    createEvent,getEvent,getEventsForUser,getEventsByCoach
}