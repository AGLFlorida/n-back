import { ScrollView } from "react-native";
import { ReactNode } from "react";

import { height } from "@/styles/globalStyles";


type DisplayProps = {
  children: ReactNode;
}
const Display = ({ children }: DisplayProps) => {
  const makeScroll: boolean = height < 800;

  return (
    <>
      {makeScroll &&
        <ScrollView>
          {children}
        </ScrollView>
      }
      {!makeScroll &&
        <>
          {children}
        </>
      }
    </>
  )
}


export default Display;