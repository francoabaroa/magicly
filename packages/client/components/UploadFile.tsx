import React, { useState, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG, DOC_TYPE } from '../constants/appStrings';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import HomeWorkDropdown from './home/HomeWorkDropdown';

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
  ) {
    addDocument(
      file: $file,
      name: $name,
      type: $type,
      keywords: $keywords,
      notes: $notes,
      homeworkId: $homeworkId,
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
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    formControl: {
      minWidth: '350px',
    },
    centerText: {
      textAlign: 'center',
    },
    xButton: {
      fontSize: '26px',
      fontWeight: 'bold'
    },
    notes: {
      minWidth: '350px',
      marginBottom: '40px',
    },
    title: {
      fontFamily: 'Playfair Display',
      fontStyle: 'normal',
      fontWeight: 'bold',
    }
  }),
);

const UploadFile = () => {
  const classes = useStyles();
  const router = useRouter();
  const [lastUploaded, setLastUploaded] = useState({});
  const [uploadedDoc, setUploadedDoc] = useState({});
  const [filename, setFilename] = useState('');
  const [uploadSingleDoc, { loading, error, data }] = useMutation(ADD_DOCUMENT);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [folder, setFolder] = useState('Existing');
  const [homeworkId, setHomeworkId] = React.useState('');
  const [newFolderName, setNewFolderName] = useState('');

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{JSON.stringify(error, null, 2)}</div>;

  const submitForm = event => {
    event.preventDefault();
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
        homeworkId
      }
    };
    uploadSingleDoc(variables);
  }

  if (data && data.addDocument && data.addDocument.filename) {
    // TODO: show dialog message when document is created!
    if (process.browser || (window && window.location)) {
      window.location.href = url + 'home/documents';
    } else {
      router.push('/home/documents', undefined);
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

  return (
    <div className={classes.root}>
      <form onSubmit={submitForm}>
        <Grid container spacing={3} justify="center" alignContent="center" alignItems="center" className={classes.centerText}>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h1 className={classes.title}>Add a New Document</h1>
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <Button
              variant="contained"
              component="label"
              style={{ backgroundColor: '#E59500', color: 'white' }}
            >
              Choose Document
              <input id="fileinput" type="file" required onChange={onChange} style={{ display: "none" }} />
            </Button>
            {filename.length > 0 ?
              <div style={{ paddingLeft: '5px' }}> <span>{filename}</span> <span onClick={removeFile} className={classes.xButton}>×</span></div> :
              null
            }
          </Grid>

          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <TextField autoComplete="off" id="standard-basic" label="Document name" onChange={event => setName(event.target.value)} required className={classes.formControl} />
          </Grid>

          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <FormControl className={classes.formControl} required>
              <InputLabel>Document type</InputLabel>
              <Select
                value={type}
                onChange={handleTypeSelect}
              >
                <MenuItem value={DOC_TYPE.IMAGE}>{getCapitalizedString(DOC_TYPE.IMAGE)}</MenuItem>
                <MenuItem value={DOC_TYPE.RECEIPT}>{getCapitalizedString(DOC_TYPE.RECEIPT)}</MenuItem>
                <MenuItem value={DOC_TYPE.MANUAL}>{getCapitalizedString(DOC_TYPE.MANUAL)}</MenuItem>
                <MenuItem value={DOC_TYPE.WARRANTY}>{getCapitalizedString(DOC_TYPE.WARRANTY)}</MenuItem>
                <MenuItem value={DOC_TYPE.TAX}>{getCapitalizedString(DOC_TYPE.TAX)}</MenuItem>
                <MenuItem value={DOC_TYPE.PROPERTY}>{getCapitalizedString(DOC_TYPE.PROPERTY)}</MenuItem>
                <MenuItem value={DOC_TYPE.INSURANCE}>{getCapitalizedString(DOC_TYPE.INSURANCE)}</MenuItem>
                <MenuItem value={DOC_TYPE.CERTIFICATE}>{getCapitalizedString(DOC_TYPE.CERTIFICATE)}</MenuItem>
                <MenuItem value={DOC_TYPE.FAMILY}>{getCapitalizedString(DOC_TYPE.FAMILY)}</MenuItem>
                <MenuItem value={DOC_TYPE.EXPENSE}>{getCapitalizedString(DOC_TYPE.EXPENSE)}</MenuItem>
                <MenuItem value={DOC_TYPE.INVESTMENT}>{getCapitalizedString(DOC_TYPE.INVESTMENT)}</MenuItem>
                <MenuItem value={DOC_TYPE.OTHER}>{getCapitalizedString(DOC_TYPE.OTHER)}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} lg={12}>
            <HomeWorkDropdown setHomeworkId={setHWID} homeworkId={homeworkId} />
          </Grid>

          {/* <Grid item xs={12} lg={12} md={12} sm={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Do you want to save this in an existing folder or new one?</FormLabel>
              <RadioGroup aria-label="folder" name="folder1" value={folder} onChange={handleChange}>
                <FormControlLabel value={"Existing"} control={<Radio />} label="Existing" />
                <FormControlLabel value={"New"} control={<Radio />} label="New" />
              </RadioGroup>
            </FormControl>
          </Grid> */}

          {/* <Grid item xs={12} lg={12} md={12} sm={12}>
            <p>Enter keywords describing this document (separated by a comma, for example: home, warranty, 2009): <input type='text' onChange={separateKeywords} autoComplete='on' required /></p>
          </Grid> */}

          <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
            <TextField autoComplete="off" className={classes.notes} id="standard-basic" label="Additional notes" onChange={event => setNotes(event.target.value)} />
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
            <Button variant="contained" style={{ backgroundColor: '#840032', color: 'white' }} type='submit'>
              Save
            </Button>
            <Button
              onClick={() => router.back()}
              variant="contained"
              style={{marginLeft: '10px'}}>
                Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default UploadFile;