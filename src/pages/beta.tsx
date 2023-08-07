import React, { useState } from 'react';
import '../styles/globals.css'
import Header from '../components/Header';
import IndexMakerForm from '../components/IndexMakerForm'

export default function Beta() {
    return (
  
      <div>
        <Header /> 
        <div>
          <IndexMakerForm />
        </div>
      </div>
    );
  }
  