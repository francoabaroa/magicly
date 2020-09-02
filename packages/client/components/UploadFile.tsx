import React, { useEffect, useState } from "react";
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const SINGLE_UPLOAD = gql`
  mutation($file: Upload!) {
    singleUpload(file: $file) {
      filename
      mimetype
      encoding
      url
    }
  }
`;

const UploadFile = () => {
  const [lastUploaded, setLastUploaded] = useState({});
  const [uploadedDoc, setUploadedDoc] = useState({});
  const [mutate, { loading, error, data }] = useMutation(SINGLE_UPLOAD);
  const onChange = ({
    target: {
      validity,
      files: [file]
    }
  }: any) => {
    validity.valid && setUploadedDoc(file);
  }

  const uploadDoc = () => {
    mutate({ variables: { file: uploadedDoc } });
  };

  useEffect(() => {
    if (data) setLastUploaded(data.singleUpload);
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{JSON.stringify(error, null, 2)}</div>;

  return (
    <React.Fragment>
      <input type="file" required onChange={onChange} />
      <button onClick={uploadDoc}>upload doc</button>
      <br />
      {Object.keys(lastUploaded).length !== 0 && (
        <div>
          {" "}
          Last uploaded details = {JSON.stringify(lastUploaded, null, 2)}{" "}
        </div>
      )}
    </React.Fragment>
  );
};

export default UploadFile