import User from "../models/user";
import { hashPassword } from "../../helpers/authHelpers";
import mongoose from 'mongoose';
import { userOneId, userTwoId } from "../../types/seedsIds";

const seedUsers = async () => {
    const users = [
        {
            _id: new mongoose.Types.ObjectId(userOneId),
            firstName: "Editor",
            lastName: "one",
            email: "editor@kickside.rw",
            password: await hashPassword("password123"),
            role: "editor",
        },
        {
            _id: new mongoose.Types.ObjectId(userTwoId),
            firstName: "Journalist",
            lastName: "One",
            email: "journalist1@kickside.rw",
            password: await hashPassword("password123"),
            role: "journalist",
        }
    ];

    await User.deleteMany({});
    await User.insertMany(users);
    console.log("Users seeded successfully.");
};

export async function unseedUsers() {
    await User.deleteMany({});
    console.log("Users removed successfully.");
}

export default seedUsers;
