import Pusher, { Channel } from "pusher-js";
import { useEffect, useRef, useState } from "react";

const usePusher = () => {
  const [channel, setChannel] = useState<Channel>();
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: "/api/pusher-auth",
    });

    const pusherChannel = pusher.subscribe("presence-client-synth-events");
    setChannel(pusherChannel);
    pusherChannel.bind("pusher:subscription_succeeded", (members: any) => {
      setUserCount(members.count - 1);
    });
    pusherChannel.bind("pusher:member_added", (member: any) => {
      setUserCount((prev) => prev + 1);
    });
    pusherChannel.bind("pusher:member_removed", (member: any) => {
      setUserCount((prev) => prev - 1);
    });

    return () => {
      pusher.unbind_all();
      pusher.unsubscribe("presence-client-synth-events");
    };
  }, []);

  return { channel, userCount };
};

export default usePusher;
