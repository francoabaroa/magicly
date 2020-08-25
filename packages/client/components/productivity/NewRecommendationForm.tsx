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

const CREATE_LIST_ITEM = gql`
  mutation CreateListItem(
    $name: String!,
    $type: ItemType!,
    $notes: String,
    $listType: String,
  ) {
    createListItem(
      name: $name,
      type: $type,
      notes: $notes,
      listType: $listType
    ) {
      id
    }
  }
`;

const NewRecommendationForm = () => {
  const [createListItem, { data, loading, error }] = useMutation(CREATE_LIST_ITEM);
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');

  const submitForm = event => {
    event.preventDefault();
    const variables = {
      variables: {
        name,
        type,
        notes,
      }
    };

    createListItem(variables);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (data && data.createListItem && data.createListItem.id) {
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
        <p>Name: <input type='text' onChange={event => setName(event.target.value)} autoComplete='on' required /></p>

        <p>What type of recommendation is it?</p>
        <input type='radio' id='movie' name='type' value='movie' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>movie</label><br />
        <input type='radio' id='tv' name='type' value='tv' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>tv</label><br />
        <input type='radio' id='food' name='type' value='food' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>food</label><br />
        <input type='radio' id='restaurant' name='type' value='restaurant' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>restaurant</label><br />
        <input type='radio' id='music' name='type' value='music' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>music</label><br />
        <input type='radio' id='travel' name='type' value='travel' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>travel</label><br />
        <input type='radio' id='accomodation' name='type' value='accomodation' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>accomodation</label><br />
        <input type='radio' id='product' name='type' value='product' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>product</label><br />
        <input type='radio' id='service' name='type' value='service' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>service</label><br />
        <input type='radio' id='personal' name='type' value='personal' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>personal</label><br />
        <input type='radio' id='work' name='type' value='work' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>work</label><br />
        <input type='radio' id='family' name='type' value='family' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>family</label><br />
        <input type='radio' id='health' name='type' value='health' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>health</label><br />
        <input type='radio' id='shopping' name='type' value='shopping' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>shopping</label><br />
        <input type='radio' id='gift' name='type' value='gift' onChange={event => setType(event.target.value.toUpperCase())} required />
        <label>gift</label><br />

        <p>Notes: <input type='text' onChange={event => setNotes(event.target.value)} autoComplete='on' /></p>

        <p><button type='submit'>Add</button></p>
      </form>
    </div>
  )
}

export default NewRecommendationForm;