const db = require('../dbConnect');

module.exports = class Product {

    id;
    ref;
    name;
    price;
    mesure;
    actif;
    created_at;
    updated_at;

    constructor(params) {
        if(params.id) { this.id = params.id }
        if(params.ref) { this.ref = params.ref}
        if(params.name) { this.name = params.name}
        if(params.price) { this.price = params.price}
        if(params.mesure) { this.mesure = params.mesure}
        if(params.actif) { this.actif = params.actif}
        if(params.created_at) { this.created_at = params.created_at }
        if(params.updated_at) { this.updated_at = params.updated_at }
    }

    /**
     * Save product
     */
    async save() {
        try {
            console.log(this);
            const query = 'INSERT INTO "product" (ref, name, price, mesure) VALUES($1, $2, $3, $4) RETURNING *;';
            const values = [this.ref, this.name, this.price, this.mesure];
            const result = await db.query(query, values);
            if(result.rowCount == 1){
                this.id = result.rows[0].id;
                this.created_at = result.rows[0].created_at;
                console.log(this);
                return this;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
            const errMessage = {
                "error" : error.detail
            }
            return errMessage;
        }
    }

    /**
     * FindALL 
     */
    static async findAll() {
        try {
            const query = 'SELECT * FROM "product";';
            const result = await db.query(query);
            if(result.rowCount < 1){
                return {"message": "Pas de résultat."};
            }
            return result.rows;
        } catch (error) {
            console.log(error);
            const errMessage = {
                "error" : error.detail
            }
            return errMessage;
        }
    }
    /**
     * Search one product by ID
     * @param {id} id int  
     */
    static async findOne(id) {
        try {
            if(!id) { false };
            const query = 'SELECT * FROM "product" WHERE id=$1;';
            const values = [id];
            const result = await db.query(query, values);
            if(result.rowCount == 1) {
                return result.rows[0];
            }else{
                return {"message": "Pas de résultat."};
            }
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    }

    static async paginate(limit, offset){
        try {
            const query = `
            SELECT *
            FROM "product" 
            WHERE "actif"=1
            ORDER BY "created_at" 
            DESC 
            LIMIT $1 
            OFFSET $2;
            `;
            const values = [limit, offset];
            const result = await db.query(query,values);
            if(result.rows){
                return result.rows;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async countProducts() {
        try {
            const query = 'SELECT count(id) FROM "product" WHERE "actif"=1;';
            const result = await db.query(query);
            if(result.rows[0].count){
                return result.rows[0].count;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * Edit product
     * @param {id} id 
     * @param {name} name 
     */
    static async edit(id, ref, name, price, mesure) {
        try {
            const query = 'UPDATE "product" SET ref=$1, name=$2, price=$3, mesure=$4, updated_at=now() WHERE id=$5 RETURNING *;';
            const values = [ref, name, price, mesure, id];
            const result = await db.query(query, values);
            if(result.rowCount == 1){
                return result.rows[0];
            }else {
                return false;
            }
        } catch (error) {
            console.log(error);
            const errMessage = {
                "error" : error.detail
            }
            return errMessage;
        }
    }

    static async archive(id) {
        try {
            const query = 'UPDATE "product" SET actif=0, updated_at=now() WHERE id=$1;';
            const values = [id];
            const result = await db.query(query, values);
            if(result.rowCount == 1) {
                return true;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    static async findByRefOrName(search) {
        try {
            const query = `SELECT * FROM "product" WHERE lower("ref") LIKE $1 OR lower("name") LIKE $1;`;
            const values = ['%'+search+'%'];
            const result = await db.query(query, values);
            if(result.rowCount == 0){
                return []; 
            }else{
                return result.rows;
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async addProductOnSav(idSav, idProduct, idUser){
        try {
            const query = 'INSERT INTO "order_repair_product" (order_repair_id, product_id, user_id) VALUES ($1, $2, $3) RETURNING *;';
            const values = [idSav, idProduct, idUser];
            const result = await db.query(query, values);
            
            if(result.rowCount == 1) {
                const resultToSend = await this.findOne(idProduct);
                resultToSend.idrel = result.rows[0].id
                resultToSend.qty = result.rows[0].qty
                return [resultToSend];
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }


    static async productBySav(idSav) {
        try {
            const query = `SELECT "product".*, "order_repair_product".qty, "order_repair_product".id as idRel
            FROM "order_repair_product"
            LEFT JOIN "product" 
            ON "order_repair_product".product_id="product".id
            WHERE "order_repair_product".order_repair_id=$1;`;
            const values = [idSav];
            const result = await db.query(query,values);
            if(result.rowCount == 0){
                return [];
            }else{
                return result.rows;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async deleteProductOnSav(id) {
        try {
            const query = 'DELETE FROM "order_repair_product" WHERE id=$1;';
            const values = [id];

            const result = await db.query(query, values);
            if(result.rowCount == 0){
                return false;
            }

            return true;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

};

