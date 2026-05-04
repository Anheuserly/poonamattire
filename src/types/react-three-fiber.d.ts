import type { ThreeElements } from "@react-three/fiber";
import "@react-three/fiber";

declare module "react" {
  namespace JSX {
    // React Three Fiber augments React's JSX runtime for mesh primitives.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends ThreeElements {}
  }
}

export {};
