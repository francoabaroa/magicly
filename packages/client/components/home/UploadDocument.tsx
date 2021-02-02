import React, { useState, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG, DOC_TYPE } from '../../constants/appStrings';
import MagiclyPageTitle from '../../components/shared/MagiclyPageTitle';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import MagiclyButton from '../shared/MagiclyButton';
import MagiclyError from '../shared/MagiclyError';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import HomeWorkDropdown from './HomeWorkDropdown';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    uploadBtn: {
      fontFamily: 'Overpass, serif',
      fontWeight: 'bold',
      fontSize: '14px',
      margin: '0 auto',
      display: 'block',
      color: '#FFF',
      backgroundColor: '#002642',
      borderRadius: '50px',
      width: '175px',
      height: '40px',
      marginTop: '10px',
      marginBottom: '10px',
      [theme.breakpoints.down('md')]: {
        fontSize: '14px',
        width: '150px',
        height: '45px'
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
  return (
    <div className={classes.root}>
      <Grid container justify="center" alignContent="center" alignItems="center" className={classes.centerText}>
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <MagiclyPageTitle
            title={'Add a New ' + title}
          />
        </Grid>

        <Grid item xs={12} lg={12} md={12} sm={12}>
          <Button
            variant="contained"
            component="label"
            className={classes.uploadBtn}
          >
            Choose {title}
            <input id="fileinput" type="file" required onChange={onChange} style={{ display: "none" }} />
          </Button>
          {filename.length > 0 ?
            <div style={{ paddingLeft: '5px' }}> <span>{filename}</span> <span onClick={removeFile} className={classes.xButton}>×</span></div> :
            null
          }
        </Grid>

        <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
          <TextField autoComplete="off" id="standard-basic" label={title + ' name'} onChange={event => setName(event.target.value)} required className={classes.formControl} />
        </Grid>

        {receipt === 'true' ? null : <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
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
              <MenuItem value={DOC_TYPE.HEALTH}>{getCapitalizedString(DOC_TYPE.HEALTH)}</MenuItem>
              <MenuItem value={DOC_TYPE.OTHER}>{getCapitalizedString(DOC_TYPE.OTHER)}</MenuItem>
            </Select>
          </FormControl>
        </Grid>}

        {receipt === 'true' ? <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
          <TextField autoComplete="off" id="standard-basic" label="Receipt value (USD)" onChange={event => setDocValue(event.target.value)} className={classes.formControl} />
        </Grid> : null}

        <Grid item xs={12} lg={7} md={12} sm={12} className={classes.moreDetailsBtn}>
          <MagiclyButton
            btnLabel={moreDetails ? 'Hide Details' : 'Add More Details'}
            onClick={toggleMoreDetailsButton}
          />
        </Grid>

        {moreDetails ? <Grid item xs={12} lg={12}>
          <HomeWorkDropdown setHomeworkId={setHWID} homeworkId={homeworkId} />
        </Grid> : null}

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

        {moreDetails ? <Grid item xs={12} lg={7} md={12} sm={12} className={classes.centerText}>
          <TextField autoComplete="off" className={classes.notes} id="standard-basic" label="Additional notes" onChange={event => setNotes(event.target.value)} />
        </Grid> : null}

        <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <Grid item xs={12} lg={12} md={12} sm={12} className={classes.centerText}>
          <MagiclyButton
            btnLabel={'Save'}
            onClick={submitForm}
          />
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12} className={classes.cancelBtn}>
          <MagiclyButton
            btnLabel={'Cancel'}
            isWhiteBackgroundBtn={true}
            onClick={() => router.push('/home/documents' , undefined)}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default UploadDocument;