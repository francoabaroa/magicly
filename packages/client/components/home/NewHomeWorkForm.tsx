import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { APP_CONFIG } from '../../constants/appStrings';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { withApollo } from '../../apollo/apollo';

// TODO: clean up before prod
let url = null;
if (process.env.NODE_ENV === 'development') {
  url = APP_CONFIG.devUrl;
} else {
  url = APP_CONFIG.prodUrl;
}

const CREATE_HOMEWORK = gql`
  mutation CreateHomework(
    $title: String!,
    $status: Status!,
    $type: HomeworkType!,
    $notificationType: NotificationType!,
    $keywords: [String],
    $cost: Int,
    $costCurrency: CostCurrency,
    $notes: String,
    $executionDate: Date,
    $executor: String,
  ) {
    createHomework(
      title: $title,
      status: $status,
      type: $type,
      notificationType: $notificationType,
      keywords: $keywords,
      cost: $cost,
      costCurrency: $costCurrency,
      notes: $notes,
      executionDate: $executionDate,
      executor: $executor,
    ) {
      id
    }
  }
`;

const NewHomeWorkForm = () => {
  const [createHomework, { data, loading, error }] = useMutation(CREATE_HOMEWORK);
  const router = useRouter();

  const [cost, setCost] = useState('');
  const [costCurrency, setCostCurrency] = useState('USD');
  const [document, setDocument] = useState('');
  const [executionDate, setExecutionDate] = useState('');
  const [executor, setExecutor] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [notes, setNotes] = useState('');
  const [notificationType, setNotificationType] = useState('NONE');
  const [reminder, setReminder] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');

  const submitForm = event => {
    event.preventDefault();
    const executionDateObj = new Date(executionDate);
    const today = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const workDate = new Date(executionDate).toLocaleString('en-US', { timeZone: 'America/New_York' });
    const status = workDate < today ? 'PAST' : 'UPCOMING';
    const variables = {
      variables: {
        title,
        status,
        type,
        notificationType,
        keywords,
        cost: parseFloat(cost),
        costCurrency,
        notes,
        executionDate: executionDateObj,
        executor
      }
    };

    createHomework(variables);
  }

  const setReminderType = () => {
    return (
      <span>
        <p>How do you want to be reminded?</p>
        <input type='radio' id='sms' name='notificationType' value='sms' onChange={event => setNotificationType(event.target.value.toUpperCase())} required/>
        <label>sms</label><br />
        <input type='radio' id='call' name='notificationType' value='call' onChange={event => setNotificationType(event.target.value.toUpperCase())} required/>
        <label>call</label><br />
        <input type='radio' id='whatsapp' name='notificationType' value='whatsapp' onChange={event => setNotificationType(event.target.value.toUpperCase())} required/>
        <label>whatsapp</label><br />
        <input type='radio' id='email' name='notificationType' value='email' onChange={event => setNotificationType(event.target.value.toUpperCase())} required/>
        <label>email</label><br />
      </span>
    );
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (data && data.createHomework && data.createHomework.id) {
    // TODO: show dialog message when homework is created!
    if (process.browser || (window && window.location)) {
      window.location.href = url + 'home/work';
    } else {
      router.push('/home/work', undefined);
    }
  }

  return (
    <div>
      <form onSubmit={submitForm}>
        <p>Title: <input type='text' onChange={event => setTitle(event.target.value)} autoComplete='on' required /></p>

        <p>What type of home work is it?</p>
        <input type='radio' id='maintenance' name='type' value='maintenance' onChange={event => setType(event.target.value.toUpperCase())} required/>
        <label>maintenance</label><br/>
        <input type='radio' id='repair' name='type' value='repair' onChange={event => setType(event.target.value.toUpperCase())} required/>
        <label>repair</label><br/>
        <input type='radio' id='installation' name='type' value='installation' onChange={event => setType(event.target.value.toUpperCase())} required/>
        <label>installation</label><br />
        <input type='radio' id='cleaning' name='type' value='cleaning' onChange={event => setType(event.target.value.toUpperCase())} required/>
        <label>cleaning</label><br />
        <input type='radio' id='other' name='type' value='other' onChange={event => setType(event.target.value.toUpperCase())} required/>
        <label>other</label>

        {/* TODO: date storage for backend!! 2020-08-27 */}
        <p>When will it occur? <input type='date' onChange={event => setExecutionDate(event.target.value)} autoComplete='on' required/></p>

        {/* if YES, show option to select notificationType */}
        {/* TODO: need to add NONE to notificationType */}
        {/* TODO: need to get their phone number for this */}
        <p>Would you like to set a reminder for this?</p>
        <input type='radio' id='no' name='reminder' value='no' onChange={event => setReminder(event.target.value)}/>
        <label>no</label><br />
        <input type='radio' id='yes' name='reminder' value='yes' onChange={event => setReminder(event.target.value)}/>
        <label>yes</label><br />

        {
          reminder === 'yes' ?
            setReminderType() :
            null
        }

        <p>Cost Estimate (USD): <input type='number' onChange={event => setCost(event.target.value)} autoComplete='on' /></p>

        <p>Who did it/will be doing it?: <input type='text' onChange={event => setExecutor(event.target.value)} autoComplete='on' /></p>

        {/* if YES, show option to attach doc */}
        <p>Would you like to attach a document for this?</p>
        <input type='radio' id='no' name='document' value='no' />
        <label>no</label><br />
        <input type='radio' id='yes' name='document' value='yes' />
        <label>yes</label><br />

        <p>Notes: <input type='text' onChange={event => setNotes(event.target.value)} autoComplete='on' /></p>

        <p><button onClick={() => router.back()}>Cancel</button><button type='submit'>Add</button></p>
      </form>
    </div>
  )
}

export default NewHomeWorkForm;