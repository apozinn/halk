import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { Userpic } from "react-native-userpic";

export default function StatusAvatar({ navigation, stts, stories }) {
  const [pd, setPd] = useState("");
  const [path, setPath] = useState([]);

  function myArc(cx, cy, radius, max) {
    var d = " M " + (cx + radius) + " " + cy;
    let ang = 0;
    while (ang <= max) {
      var radians = ang * (Math.PI / 180);
      var x = cx + Math.cos(radians) * radius;
      var y = cy + Math.sin(radians) * radius;
      d += " L " + x + " " + y;
      ang++;
    }
    setPd(d);
  }

  async function init(a) {
    if (stories.length > 0) {
      myArc(
        35,
        35,
        30,
        parseInt(360 / stories.length) == 360
          ? 360
          : parseInt(360 / stories.length) - 8
      );
      let arr = [];
      let rot = 270;
      await stories.map((i, index) => {
        arr.push(
          <View
            style={{ position: "absolute", rotate: `${rot}deg`, top: -10, left: -10 }}
            key={index}
          >
            <Svg width="70" height="70">
              <Path
                d={pd}
                fill="none"
                stroke={i[1] == 0 ? "#007dff" : "#b7b7b7"}
                strokeWidth={2}
              />
            </Svg>
          </View>
        );
        rot = rot + 360 / stories.length;
      });
      setPath(arr);
    }
  }

  useEffect(() => {
    init(stories);
  }, [stories, pd]);

  return (<View style={{ alignItems: 'baseline' }}>
      {path}
      <Userpic
        size={50}
        name={stts.author.profile.name}
        source={{ uri: stts.author.profile.avatar }}
        colorize={true}
        borderRadius="50%"
        style={{}}
      />
    
  </View>);
}
