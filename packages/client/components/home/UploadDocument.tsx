import React, { useState, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG, DOC_TYPE } from '../../constants/appStrings';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import MagiclyError from '../shared/MagiclyError';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import HomeWorkDropdown from './HomeWorkDropdown';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  Box,
  Container,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@material-ui/core';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const ADD_DOCUMENT = gql`
  mutation AddDocument(
    $file: Upload!,
    $name: String!,
    $type: DocType!,
    $keywords: [String]
    $notes: String,
    $homeworkId: String,
    $docValue: Float,
  ) {
    addDocument(
      file: $file,
      name: $name,
      type: $type,
      keywords: $keywords,
      notes: $notes,
      homeworkId: $homeworkId,
      docValue: $docValue
      ) {
      filename
      mimetype
      encoding
      url
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formTextFields: {
      marginBottom: '15px',
    },
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    moreDetailsBtn: {
      textAlign: 'center',
      marginTop: '30px',
      marginBottom: '10px',
    },
    cancelBtn: {
      textAlign: 'center',
      marginTop: '10px',
    },
    chooseBtn: {
      fontFamily: 'Overpass, serif',
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      marginTop: '50px',
      color: '#FFF',
      backgroundColor: '#002642',
      borderRadius: '50px',
      width: '175px',
      height: '40px',
      [theme.breakpoints.down('md')]: {
        fontSize: '14px',
        width: '150px',
        height: '45px'
      },
    },
    formControl: {
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
    centerText: {
      textAlign: 'center',
    },
    xButton: {
      fontSize: '26px',
      fontWeight: 'bold'
    },
    notes: {
      marginBottom: '40px',
      minWidth: '550px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '350px',
      },
    },
    title: {
      fontFamily: 'Playfair Display',
      fontStyle: 'normal',
      fontWeight: 'bold',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    fileChip: {
      margin: '0 auto',
      marginTop: '0px',
      marginBottom: '20px',
      display: 'block',
      textAlign: 'center'
    },
    uploadBtn: {
      fontFamily: 'Overpass, serif',
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '0 auto',
      textAlign: 'center',
      display: 'block',
      color: '#FFF',
      backgroundColor: '#002642',
      borderRadius: '50px',
      maxWidth: '160px',
      height: '40px',
      marginBottom: '15px',
      [theme.breakpoints.down('md')]: {
        fontSize: '14px',
        maxWidth: '160px',
        height: '40px'
      },
    },
  }),
);

const UploadDocument = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const { receipt, hwid } = router.query;

  const [uploadSingleDoc, { loading, error, data }] = useMutation(ADD_DOCUMENT);

  const [lastUploaded, setLastUploaded] = useState({});
  const [uploadedDoc, setUploadedDoc] = useState({});
  const [filename, setFilename] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [docValue, setDocValue] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [folder, setFolder] = useState('Existing');
  const [homeworkId, setHomeworkId] = React.useState(hwid ? hwid : '');
  const [shouldRedirectToHomeWork, setShouldRedirectToHomeWork] = useState(hwid ? true : false);
  const [newFolderName, setNewFolderName] = useState('');
  const [moreDetails, setMoreDetails] = useState(hwid ? true : false);
  const [open, setOpen] = React.useState(false);
  const [type, setType] = useState(receipt === 'true' ? DOC_TYPE.RECEIPT : '');

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const onChange = ({
    target: {
      validity,
      files: [file]
    }
  }: any) => {
    validity.valid && setUploadedDoc(file);
    setFilename(file.name);
  };

  useEffect(() => {
    if (data) setLastUploaded(data.addDocument);
  }, [data]);

  if (error) return <MagiclyError message={error.message} hideLayout={true}/>;

  const submitForm = () => {
    handleToggle();
    if (type === '') {
      alert('You need to select a document type');
      return;
    }

    const variables = {
      variables: {
        file: uploadedDoc,
        name,
        type,
        keywords,
        notes,
        homeworkId,
        docValue: isNaN(parseFloat(docValue)) ? 0 : parseFloat(docValue)
      }
    };
    uploadSingleDoc(variables);
  }

  if (data && data.addDocument && data.addDocument.filename) {
    // TODO: show dialog message when document is created!
    let path = '';
    if (receipt === 'true') {
      path = 'finance/receipts';
    } else {
      path = 'home/documents';
    }
    if (shouldRedirectToHomeWork) {
      path = 'home/work';
    }
    if (process.browser || (window && window.location)) {
      window.location.href = url + path;
    } else {
      router.push('/' + path, undefined);
    }
  }

  const handleTypeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as DOC_TYPE);
  };

  const getCapitalizedString = (name: string) => {
    const lowerCaseTitle = name.toLowerCase();
    if (typeof lowerCaseTitle !== 'string') return ''
    return lowerCaseTitle.charAt(0).toUpperCase() + lowerCaseTitle.slice(1)
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let folderType: string = event.target.value === 'Existing' ? 'Existing' : 'New';
    setFolder(folderType);
  };

  const toggleMoreDetailsButton = () => {
    setMoreDetails(!moreDetails)
  };

  const separateKeywords = (event) => {
    const keywords =
      event.target.value.split(',')
      .map(
        keyword => keyword.trim()
      )
      .filter(
        keyword => keyword.length >= 1
      );
    setKeywords(keywords);
  };

  const setHWID = (event: React.ChangeEvent<{ value: unknown }>) => {
    setHomeworkId(event.target.value as string);
  };

  const clearFileInput = (file) => {
    try {
      file.value = null;
    } catch (ex) { }
    if (file.value) {
      file.parentNode.replaceChild(file.cloneNode(true), file);
    }
  };

  const removeFile = () => {
    setUploadedDoc({});
    setFilename('');
    clearFileInput(document.getElementById('fileinput'));
  };

  let title = receipt === 'true' ? 'Receipt' : 'Document';
  let docTypeOptions = [
    DOC_TYPE.IMAGE,
    DOC_TYPE.RECEIPT,
    DOC_TYPE.MANUAL,
    DOC_TYPE.WARRANTY,
    DOC_TYPE.TAX,
    DOC_TYPE.PROPERTY,
    DOC_TYPE.INSURANCE,
    DOC_TYPE.CERTIFICATE,
    DOC_TYPE.FAMILY,
    DOC_TYPE.EXPENSE,
    DOC_TYPE.INVESTMENT,
    DOC_TYPE.HEALTH,
    DOC_TYPE.OTHER
  ];

  return (
    <Container maxWidth="lg">
      <Box mt={3}>
        <form
          autoComplete="off"
          noValidate
        >
          <Card>
            <CardHeader
              title={`New ${title}`}
            />
            <Divider />
            <CardContent>

              <Button
                variant="contained"
                component="label"
                className={classes.uploadBtn}
              >
                Choose {title}
                <input id="fileinput" type="file" required onChange={onChange} style={{ display: "none" }} />
              </Button>

              {filename.length > 0 ?
                <div className={classes.fileChip}> <span>{filename}</span> <span onClick={removeFile} className={classes.xButton}>×</span></div> :
                null
              }

              <TextField
                fullWidth
                name="name"
                autoComplete="off"
                label={title + ' name'}
                onChange={event => setName(event.target.value)}
                required
                variant="outlined"
                className={classes.formTextFields}
              />

              {receipt === 'true' ? null : <TextField
                fullWidth
                label="Document type"
                name="type"
                required
                select
                SelectProps={{ native: true }}
                value={type}
                onChange={handleTypeSelect}
                variant="outlined"
                className={classes.formTextFields}
              >
                {docTypeOptions.map((option, index) => (
                  <option
                    key={index}
                    value={option}
                  >
                    {getCapitalizedString(option)}
                  </option>
                ))}
              </TextField>}

              {receipt === 'true' ? <TextField
                fullWidth
                name="cost"
                autoComplete="off"
                label="Receipt value (USD)"
                onChange={event => setDocValue(event.target.value)}
                required
                type="number"
                variant="outlined"
                className={classes.formTextFields}
              /> : null}

              <HomeWorkDropdown setHomeworkId={setHWID} homeworkId={homeworkId} />

              <TextField
                fullWidth
                label="Notes"
                name="notes"
                onChange={event => setNotes(event.target.value)}
                variant="outlined"
                className={classes.formTextFields}
              />

              <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
                <CircularProgress color="inherit" />
              </Backdrop>

            </CardContent>
            <Divider />
            <Box
              display="flex"
              justifyContent="flex-end"
              p={2}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={submitForm}
              >
                Save
            </Button>
            </Box>
          </Card>
        </form>
      </Box>
    </Container>
  );
}

export default UploadDocument;