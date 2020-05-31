const Action = require('../models/Action');
const Activity = require('../models/Activities');

module.exports = actionController = {

    /**
     * List all activities with number request
     */
    allActivities : async (req, res) => {
        try {

            const nb = req.params.nb;
            // If no id, i send an error with message
            if(!nb) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            if(nb === 0){
                return res.status('403').send({"error": "Vous ne pouvez pas indiquer 0 dans votre demande."});
            }
            

            const result = await Activity.allActivities(nb);
            if(result){
                return res.send(result);

            }else{
                return res.send(false);
            }
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

    /**
     * List all activites for one Order_repair
     */
    activitiesForOneSav: async (req, res) => {
        try {
            const order_number = req.params.order_number;
            // If no order_number, i send an error with message
            if(!order_number) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }
            const result = await Activity.activityForOneSav(order_number);
            if(result){
                return res.send(result);

            }else{
                return res.send(false);
            }

        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

    /**
     * List all activites for one Order_repair
     */
    activitiesForOneUser: async (req, res) => {
        try {
            const userId = req.params.userId;
            // If no order_number, i send an error with message
            if(!userId) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            const result = await Activity.activityForOneUser(userId);
            if(result){
                return res.send(result);

            }else{
                return res.send(false);
            }

        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

};