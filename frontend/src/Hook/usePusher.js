import { useState, useEffect } from "react";
import Pusher from "pusher-js";

export default function usePusher(apikey, channels) {
  const [pusher, setPusher] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const pusher = new Pusher(apikey, {
      cluster: "ap2",
      encrypted: false,
      authEndpoint: `${process.env.REACT_APP_BACKEND_URL}sockets/authenticate`,
    });
    setPusher(pusher);
    const channel1 = pusher.subscribe(channels, {
      authEndpoint: `${process.env.REACT_APP_BACKEND_URL}sockets/authenticate`,
    });
    setChannel(channel1);
    // return (channel1) => {
    //   second;
    // };
  }, []);
  return [pusher, channel];
}
