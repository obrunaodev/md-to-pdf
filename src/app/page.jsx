'use client'

import Dropzone from "@/components/Dropzone";
import BoxedContainer from "@/components/BoxedContainer";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <BoxedContainer>

        <div className="max-w-xl mx-auto">
          <Dropzone />
        </div>
      </BoxedContainer>
    </div>
  )
}
