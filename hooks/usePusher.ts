import Pusher, { Channel } from "pusher-js";
import { useEffect, useRef, useState } from "react";

const usePusher = () => {
  const [channel, setChannel] = useState<Channel>();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: "/api/pusher-auth",
    });

    const pusherChannel = pusher.subscribe("presence-client-synth-events");
    setChannel(pusherChannel);

    return () => {
      pusher.unbind_all();
      pusher.unsubscribe("presence-client-synth-events");
    };
  }, []);

  return channel;
};

export default usePusher;
