import Matter from "matter-js";
import { PoopRenderer } from "../SharedRenderers/PoopRenderer";

let boxIds = 0;

const distance = ([x1, y1]: number[], [x2, y2]: number[]) =>
    Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

const Physics = (state: any, { time }: any) => {
    let engine = state["physics"].engine;

    Matter.Engine.update(engine, time.delta);

    return state;
};

const CreateBox = (state: any, { touches, screen }: any) => {
    let world = state["physics"].world;
    let boxSize = state.box.size[0];
    touches.filter((t: any) => t.type === "press").forEach((t: any) => {
        let x = t.event.pageX - state.parentOffset.x;
        let y = t.event.pageY - state.parentOffset.y;
        let body = Matter.Bodies.rectangle(
            x,
            y,
            boxSize,
            boxSize,
            { frictionAir: 0.021 }
        );
        Matter.World.add(world, [body]);

        state[++boxIds] = {
            body: body,
            size: [boxSize, boxSize],
            color: boxIds % 2 == 0 ? "pink" : "#B8E986",
            renderer: PoopRenderer
        };

    });

    return state;
};

const MoveBox = (state: any, { touches }: any) => {
    let constraint = state["physics"].constraint;

    //-- Handle start touch
    let start = touches.find((x: any) => x.type === "start");

    if (start) {
        let startPos = [start.event.pageX - state.parentOffset.x, start.event.pageY - state.parentOffset.y];

        let boxId = Object.keys(state).find(key => {
            let body = state[key].body;

            return (
                body &&
                distance([body.position.x, body.position.y], startPos) < 25
            );
        });

        if (boxId) {
            constraint.pointA = { x: startPos[0], y: startPos[1] };
            constraint.bodyB = state[boxId].body;
            constraint.pointB = { x: 0, y: 0 };
            constraint.angleB = state[boxId].body.angle;
        }
    }

    //-- Handle move touch
    let move = touches.find((x: any) => x.type === "move");

    if (move) {
        constraint.pointA = { x: move.event.pageX - state.parentOffset.x, y: move.event.pageY - state.parentOffset.y };
    }

    //-- Handle end touch
    let end = touches.find((x: any) => x.type === "end");

    if (end) {
        constraint.pointA = null;
        constraint.bodyB = null;
        constraint.pointB = null;
    }

    return state;
};

const CleanBoxes = (state: any, {  }: any) => {
    let world: Matter.World = state["physics"].world;

    Object.keys(state)
        .filter(key => state[key].body && state[key].body.position.y > world.bounds.max.y)
        .forEach(key => {
            Matter.Composite.remove(world, state[key].body);
            delete state[key];
        });

    return state;
};

export { Physics, CreateBox, MoveBox, CleanBoxes };