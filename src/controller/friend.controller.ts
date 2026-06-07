import { Request, Response } from "express";
import { CatchError, TryError } from "../util/error";
import FriendModel from "../model/friend.model";
import { SessionInterface } from "../middleware/auth.middleware";
import AuthModel from "../model/auth.model";
import mongoose from "mongoose";

export const addFriend = async (req: SessionInterface, res: Response) => {
  try {
    req.body.user = req.session?.id;

    const friend = await FriendModel.create(req.body);
    res.json(friend);
  } catch (error) {
    CatchError(error, res, "Failed to send friend request");
  }
};

export const fetchFriends = async (req: SessionInterface, res: Response) => {
  try {
    const user = req.session?.id;
    const friends = await FriendModel.find({ user }).populate("friend");

    res.json(friends);
  } catch (error) {
    CatchError(error, res, "Failed to send friend request");
  }
};

export const deleteFriend = async (req: Request, res: Response) => {
  try {
    await FriendModel.deleteOne({ _id: req.params.id });
    res.json({ messae: "Friend Deleted" });
  } catch (error) {
    CatchError(error, res, "Failed to send friend request");
  }
};

export const suggestedFriends = async (
  req: SessionInterface,
  res: Response,
) => {
  try {
    if (!req.session) throw TryError("Failed to suggested friend", 401);

    const friends = await AuthModel.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(req.session.id) },
        },
      },
      { $sample: { size: 5 } },
      { $project: { fullname: 1, image: 1, createdAt: 1 } },
    ]);

    const modified = await Promise.all(
      friends.map(async (item) => {
        const count = await FriendModel.countDocuments({ friend: item._id });

        return count === 0 ? item : null;
      }),
    );

    const filtered = modified.filter((item) => item !== null);

    res.json(filtered);
  } catch (error) {
    CatchError(error, res, "Failed to send friend request");
  }
};


export const friendRequest = async (req: SessionInterface, res: Response)=>{
  try {
    
    if(!req.session)
      throw TryError("Failed to fetch friends request");

    const friends = await FriendModel.find({friend:req.session.id, status: "requested"})
    .populate("user","fullname image")

    res.json(friends)
  } catch (error) {
    CatchError(error,res, "Failed to fetch friend request")
  }
}

export const updateFriendStatus = async (req: SessionInterface, res: Response)=>{
  try {
    
    if(!req.session)
      throw TryError("Failed to update friends status");

    await FriendModel.updateOne({_id: req.params.id}, {$set: {status: req.body.status}})

    res.json({message: "Friend status updated"})

  } catch (error) {
    CatchError(error,res, "Failed to fetch friend request")
  }
}