import {Inngest} from "inngest";
import {connectDB} from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({
    id:"Interview-Battleground",

});

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
    } = event.data;

    const email = email_addresses?.[0]?.email_address;

    if (!email) {
      throw new Error("Email not found in Clerk event payload");
    }

    const newUser = {
      clerkId: id,
      email,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };

    await User.create(newUser);

    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });

    //challege is : send a welcome email to the user once completed
  }
);

const deleteUserFromDb=inngest.createFunction({
    id:"delete-user-from-db"},
    {event:"clerk/user.deleted"},
    async function({event, step}) {
        await connectDB();
        const {id} = event.data;
        await User.deleteOne({clerkId:id});

        await deleteStreamUser(id.toString());
    }
)

export const functions=[syncUser,deleteUserFromDb];