'use client'

import React, {useContext} from 'react';
import {PDFViewer} from "@react-pdf/renderer";
import EbookPDF from "@/components/EbookPDF";
import {redirect, useSearchParams} from "next/navigation";
import _ from "lodash";
import {GlobalContext} from "@/context/GlobalContext";

export default function PreviewPage() {
  const {jsonData} = useContext(GlobalContext);

  if (_.isEmpty(jsonData)) {
    redirect('/');
    return null;
  }

  console.log(jsonData);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
        <PDFViewer style={{width:'100%', height:'100%'}}>
        <EbookPDF data={jsonData}/>
      </PDFViewer>
    </div>
  );
}


