import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button} from '@material-ui/core';
import axios from 'axios';
import '../css/main.css';
import Highlighter from "react-highlight-words";


const KEY_WORDS = ['HTML', 'CSS', 'JavaScript', 'Git', ' UI ', 'Principles', 'React', 'Redux', 'React Router', 'HTTP/Ajax', 'Functional Programming Techniques', 'Advanced React', 'State Management', 'Web Applications','Java Fundamentals', 'Java Frameworks', 'API Introductions','Python and OOP', 'Algorithms', 'Data Structures', 'Hash Tables and Blockchains', 'Graphs and Computer Architecture'];

const BASE_URL = 'http://ec2-18-144-69-47.us-west-1.compute.amazonaws.com:9200/jobs/jobs/_search';
const DEFAULT_QUERY = '?size=50';

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function highlight(text) {
  var inputText = document.getElementById("inputText");
  var innerHTML = inputText.innerHTML;
  var index = innerHTML.indexOf(text);
  if (index >= 0) {
   innerHTML = innerHTML.substring(0,index) + "<span class='highlight'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
   inputText.innerHTML = innerHTML;
  }
}

export default function Overlay(props) {
  const job = props.data.job || {};

  return (
    <div className="Pos(f) W(100%) H(100%) T(0) B(0) Start(0) End(0) Z(1000)" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="Bgc(white) Bdrs(6px) W(55%) Mx(a) Mb(0) Mt(100px) P(15px) H(500px) Ovy(s)">
        <div className="D(f) Pb(5px) Mb(10px) Jc(sb) Bdbw(1px) Bdbc(#eeeeee) Bdbs(s)">
          <div className="Fz(14px)">Job Details</div>
          <span className="Cur(p) Fl(end) Pend(5px)" onClick={() => props.closeOverlay()}>x</span>
        </div>
        <div className="Pt(15px)">
          <div className="D(f) Jc(sb)">
            <div className="Fz(18px)"><span className="C(#990c0c)">Company Name:</span> {job.job_company_name}</div>
            <div className="Fz(18px)"><span className="C(#990c0c)">Title:</span> {job.job_title}</div>
            <div className="Fz(18px)"><span className="C(#990c0c)">Location:</span> {job.job_location}</div>
          </div>
          <div className="Pt(20px)">
          {
            job.job_desc_text.map((text) => {

              return (

              <div className="Pt(12px)">
                <Highlighter
                    searchWords={KEY_WORDS}
                    textToHighlight={text}
                  />
              </div>
            )})
          }
          </div>
          <div className="Pt(25px) Mx(a) My(0) Ta(c) W(40%)">
            {
              job.job_url ?
              <Button className="W(100%)" target="_blank" variant="contained" color="primary" href={job.job_url}>
                Visit Job Listing
              </Button> : null
            }
          </div>
        </div>
      </div>
    </div>
  );
}
