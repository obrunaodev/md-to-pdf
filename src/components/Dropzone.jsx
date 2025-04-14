import React, {useState, useCallback, useContext} from 'react';
import { useDropzone } from 'react-dropzone';
import _ from 'lodash';
import mdjs from "@moox/markdown-to-json";
import {PDFDownloadLink, PDFViewer} from "@react-pdf/renderer";
import EbookPdfDocument from "@/components/EbookPDF";
import {useRouter, useSearchParams} from "next/navigation";
import {GlobalContext} from "@/context/GlobalContext";

function Dropzone() {
  const {jsonData, setJsonData} = useContext(GlobalContext);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);

  const router = useRouter()

  const onDrop = useCallback((acceptedFiles) => {
    const droppedFile = _.get(acceptedFiles, 0, null);
    setFile(droppedFile)
    setProgress(0);

    const reader = new FileReader();

    reader.onprogress = (event) => {
      const percentage = Math.round((event.loaded / event.total) * 100);
      setProgress(percentage);
    };

    reader.onload = () => {
      setDragging(false);
      const jsonResult = mdjs.markdownAsJsTree(reader.result)
      setJsonData(jsonResult);
    };

    reader.readAsText(droppedFile)
  }, []);

  const onClear = useCallback( () => {
    setFile(null)
    setJsonData(null)
    setProgress(0);
    setDragging(false);
  }, []);


  const dropzoneConfig = {
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: { 'text/markdown': ['.md'] },
    onDragEnter: () => setDragging(true),
    onDragLeave: () => setDragging(false),
  }


  const onPreview = () => {
    const reader = new FileReader();

    reader.onload = () => {
      const jsonResult = mdjs.markdownAsJsTree(reader.result)
      setJsonData(jsonResult);
      router.push('/preview');
    }

    reader.readAsText(file);
  }

  const { getRootProps, getInputProps, open } = useDropzone(dropzoneConfig);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        {...getRootProps()}
        data-dragging={dragging}
        className="flex flex-col items-center justify-center w-full h-80 border-2 rounded-lg cursor-pointer border-gray-300 bg-gray-50 data-[dragging=true]:border-green-400 data-[dragging=true]:bg-green-50"
      >
        <input {...getInputProps()} /> {/* Input invisível para selecionar o arquivo */}
        <div className="flex flex-col items-center justify-center pt-5 pb-6">

          <svg className="w-24 h-24 mb-4 fill-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 294.156 294.156">
            <g>
              <path d="M227.002,108.256c-2.755-41.751-37.6-74.878-80.036-74.878c-42.447,0-77.298,33.141-80.038,74.907   C28.978,113.059,0,145.39,0,184.184c0,42.234,34.36,76.595,76.595,76.595h116.483c3.313,0,6-2.687,6-6s-2.687-6-6-6H76.595   C40.977,248.778,12,219.801,12,184.184c0-34.275,26.833-62.568,61.087-64.411c3.184-0.171,5.678-2.803,5.678-5.991   c0-0.119-0.003-0.236-0.01-0.355c0.09-37.536,30.654-68.049,68.211-68.049c37.563,0,68.132,30.518,68.211,68.063   c-0.005,0.116-0.009,0.238-0.009,0.329c0,3.196,2.505,5.831,5.696,5.992c34.37,1.741,61.292,30.038,61.292,64.421   c0,19.526-8.698,37.801-23.864,50.138c-2.571,2.091-2.959,5.87-0.868,8.44c2.091,2.571,5.87,2.959,8.44,0.868   c17.98-14.626,28.292-36.293,28.292-59.447C294.156,145.269,265.08,112.926,227.002,108.256z"/>
              <path d="M140.966,141.078v76.511c0,3.313,2.687,6,6,6s6-2.687,6-6v-76.511c0-3.313-2.687-6-6-6S140.966,137.765,140.966,141.078z"/>
              <path d="M181.283,152.204c1.536,0,3.071-0.586,4.243-1.757c2.343-2.343,2.343-6.142,0-8.485l-34.317-34.317   c-2.343-2.343-6.143-2.343-8.485,0l-34.317,34.317c-2.343,2.343-2.343,6.142,0,8.485c2.343,2.343,6.143,2.343,8.485,0   l30.074-30.074l30.074,30.074C178.212,151.618,179.748,152.204,181.283,152.204z"/>
            </g>
          </svg>
          {/* Texto informativo */}
          <p className="mb-2 text-sm text-gray-40 text-center"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-400 text-center">Only .md files are accepted</p>
        </div>
      </div>

      {_.isNil(file) || (<div className="w-full mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Uploading: {_.get(jsonData, 'name', null)}</span>
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div data-progress={progress === 100} className="bg-blue-600 data-[progress=true]:bg-green-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>)}

      {_.isNil(file) ? (
        <button type="button" onClick={open}
                className="font-medium mt-4 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg text-sm px-5 py-2.5 focus:outline-none">
          Select File
        </button>
      ) : (
        <div className="flex gap-x-4 items-center justify-between">
          <button type="button" onClick={onClear}
                  className="font-medium mt-4 text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-100 rounded-lg text-sm px-5 py-2.5 focus:outline-none">
            Clear
          </button>


            <button
              disabled={_.isNil(jsonData)}
              className="disabled:cursor-not-allowed disabled:opacity-40 font-medium mt-4 text-white bg-red-500 enabled:hover:bg-red-600 focus:ring-4 enabled:focus:ring-red-100 rounded-lg text-sm px-5 py-2.5 focus:outline-none">
              {_.isNil(jsonData) ? 'Download PDF' : (
                <PDFDownloadLink
                  document={<EbookPdfDocument data={jsonData}/>}
                  fileName={`${jsonData?.title ? jsonData.title.replace(/\s+/g, '_') : 'ebook'}.pdf`}
                >
                  {({blob, url, loading, error}) =>
                    loading ? 'Generating PDF...' : 'Download PDF'
                  }
                </PDFDownloadLink>
              )}
            </button>


          <button type="button" onClick={onPreview}
                  className="font-medium mt-4 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-100 rounded-lg text-sm px-5 py-2.5 focus:outline-none">
            Preview
          </button>
        </div>

      )}
    </div>
  );
}

export default Dropzone;
