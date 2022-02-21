import Follow from "../models/follow/Follow";

/**
 * @file Declares API for Follows related data access object methods
 */

export default interface FollowDaoI {
    findAllUsersFollowing(userFollowing: string): Promise<Follow[]>;
    findAllUsersFollowers(userFollowed: string): Promise<Follow[]>;
    followUser(userFollowed:string, userFollowing: string): Promise<Follow>;
    unFollowUser(userFollowed: string, userFollowing: string): Promise<any>;
    findAllUsers(): Promise<Follow[]>;
    findOneUser(userFollowed: string, userFollowing: string): Promise<any>;
};
