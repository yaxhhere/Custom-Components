import { useState } from "react";
import styles from "./floatingCard.module.scss";

export default function FloatingCard({ children }: { children: any }) {
  const [rotation, setRotation] = useState({
    rotationX: "0deg",
    rotationY: "0deg",
  });

  const onMouseMove = (event: any) => {
    const movableDiv = document.getElementById("movable_div");
    const boundingRec: DOMRect = movableDiv?.getBoundingClientRect() as DOMRect;

    const mouseXPercent =
      ((event.clientX - boundingRec.left) /
        (boundingRec.right - boundingRec.left)) *
      100;
    const mouseYPercent =
      ((event.clientY - boundingRec.top) /
        (boundingRec.bottom - boundingRec.top)) *
      100;

    const rotateX = (mouseYPercent - 50) * 0.2;
    const rotateY = (mouseXPercent - 50) * 0.2;

    setRotation({
      rotationX: `${rotateX > 0 ? "+" : ""}${rotateX}deg`,
      rotationY: `${rotateY > 0 ? "+" : ""}${rotateY}deg`,
    });
  };

  const onMouseEnter = () => {
    setRotation((prevRotation) => ({ ...prevRotation, rotationZ: "10deg" }));
  };

  const onMouseLeave = () => {
    setRotation({ rotationX: "0deg", rotationY: "0deg" });
  };

  return (
    <div
      id="movable_div"
      style={{
        transform: `perspective(1000px) rotateX(${rotation.rotationX}) rotateY(${rotation.rotationY})`,
      }}
      className={styles.card_wrapper}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
