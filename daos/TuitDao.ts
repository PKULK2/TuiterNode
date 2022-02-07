import TuitDaoI from "../interfaces/TuitDaoI";
import TuitModel from "../mongoose/TuitModel";
import Tuit from "../models/Tuit";

export default class TuitDao implements TuitDaoI {
    async findAllTuits(): Promise<Tuit[]> {
        return await TuitModel.find();
    }
    async findTuitsByUser(uid: string): Promise<Tuit[]> {
        return await TuitModel.findById(uid);
    }
    async createTuit(tuit: Tuit): Promise<any> {
        return await TuitModel.create(tuit);
    }
    async deleteTuit(tid: string):  Promise<any> {
        return await TuitModel.deleteOne({_id: tid});
    }
    async updateTuit(tid: string, tuit: Tuit): Promise<any> {
        return await TuitModel.updateOne({_id: tid}, {$set: tuit});
    }

    async findTuitById(tid: string): Promise<Tuit> {
        return await TuitModel.findById(tid);
    }
}