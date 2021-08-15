import type { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";
import { v4 as uuidv4 } from "uuid";

const pusher = new Pusher({
  appId: process.env.PUSHER_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const presenceData = {
    user_id: uuidv4(),
    user_info: {},
  };
  const auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
}
