import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Paper, TextField, RadioGroup, FormControlLabel, Radio} from '@material-ui/core';
import axios from 'axios';
import '../css/main.css';
import Overlay  from './Overlay';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
});

const BASE_URL = 'http://ec2-18-144-69-47.us-west-1.compute.amazonaws.com:9200/jobs/jobs/_search';
const DEFAULT_QUERY = '?size=50';

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function SimpleTable() {
  const [tableData, setTableData] = useState([]);
  const [queryData, setQueryData] = useState({
    queryString: BASE_URL + DEFAULT_QUERY,
    queryObj: {}
  })
  const [showOverlay, toggleOverlay] = useState(false);
  const [overlayData, setOverlayData] = useState({});
  const [dailyJobs, setDailyJobs] = useState(9);

  const buildQueryString = (queryObj) => {
    let newString = BASE_URL + DEFAULT_QUERY;

    Object.keys(queryObj).forEach((key, it) => {

      const queryVal = queryObj[key];
      if (queryVal) {
        if (!newString.includes('&q=')) {
          newString += '&q=';
        }
        newString += key + ':' + queryVal + '+';
      }
    });

    setQueryData({
      queryObj: queryObj,
      queryString: newString
    });
  }


  const handleSearch = (e) => {
    const value = e.target.value;

    const newQueryObj = {
      ...queryData.queryObj,
      job_desc_text: value
    };

    buildQueryString(newQueryObj);
  };

  const handleRoleChange = event => {
    const value = event.target.value;

    const newQueryObj = {
      ...queryData.queryObj,
      job_title: value
    };

    buildQueryString(newQueryObj);
  }

  const handleLocationSearch = event => {
    const value = event.target.value;

    const newQueryObj = {
      ...queryData.queryObj,
      job_location: value
    };

    buildQueryString(newQueryObj);
  }

  const openOverlay = (job) => {
    let newjobnumber = dailyJobs + 1;
    setDailyJobs(newjobnumber);
    setOverlayData({
      job: job
    });
    toggleOverlay(true);
  }

  useEffect(() => {
    axios.get(queryData.queryString)
      .then(res => {
        const data = res.data || {};
        const jobs = data.hits.hits || [];
        jobs.map((job) => {
          let newJob = job;
          newJob.score = 0;
          if (newJob._source.job_title) {
            newJob.score += randomIntFromInterval(30,40);
          }

          if (newJob._source.job_location) {
            newJob.score += randomIntFromInterval(30,40);
          }

          newJob.score += randomIntFromInterval(10, 20);

          if (newJob._source.job_company_name.includes('Thunder')) {
            newJob.score = 98;
          }

          return newJob;
        });

        jobs.sort((a, b) => {
          if (a.score > b.score) return -1;
          return 1;
        });

        setTableData(jobs);
      })
  }, [queryData.queryString]);

  return (
    <div>
      {
        showOverlay ?
        <Overlay data={overlayData} closeOverlay={toggleOverlay} /> : null
      }
      <div className="P(20px) D(f) Jc(sb)">
        <img height="32px" src="/Lambda_Logo_red_small.png" />
        <div className="Fz(30px)">Harvest</div>
        <div className="Va(m) Ta(s)">
          <div className="D(f) Ai(c)">
            <span className="Pend(5px)">
            <img className="Bdrs(50%)" src='/treydon.png' height='30px'/></span>
          //   <div>
          //   Welcome <span className="Pstart(5px) C(blue)">Treyden!</span>
          //   </div>
          // </div>
          // <div className="Pt(5px)">Daily Progress: {dailyJobs} / 10 Jobs</div>
        </div>
      </div>
      <div className="W(100%) Ovx(auto) D(f)">
        <div className="W(20%) Bgc(#eeeeee) Ta(c)">
        <TextField
          id='search'
          label='Search'
          onChange={(e) => handleSearch(e)}
          margin="normal"
          variant="outlined"
        />

        <div className="Ta(s) Bgc(#e7a2ab) Mt(15px)">
          <div className="P(8px)">Roles:</div>
          <RadioGroup className="Px(8px)" aria-label="role" name="role" onChange={handleRoleChange}>
            <FormControlLabel value="frontend+engineer" control={<Radio />} label="Frontend Engineer" />
            <FormControlLabel value="fullstack+engineer" control={<Radio />} label="Fullstack Engineer" />
            <FormControlLabel value="javascript+engineer" control={<Radio />} label="Javascript Engineer" />
            <FormControlLabel value="ui+engineer" control={<Radio />} label="UI Engineer" />
            <FormControlLabel value="react+developer" control={<Radio />} label="React Developer" />
            <FormControlLabel value="software+engineer" control={<Radio />} label="Software Engineer" />
            <FormControlLabel value="web+developer" control={<Radio />} label="Web Developer" />
          </RadioGroup>
        </div>

        <div className="Ta(s) Bgc(#ce5a70) ">
          <div className="P(8px)">Technology:</div>
          <RadioGroup className="Px(8px)" aria-label="Technology" name="technology" onChange={handleSearch}>
            <FormControlLabel value="react" control={<Radio />} label="React" />
            <FormControlLabel value="angular" control={<Radio />} label="Angular" />
            <FormControlLabel value="ember" control={<Radio />} label="Ember" />
            <FormControlLabel value="mustache" control={<Radio />} label="Mustache" />
            <FormControlLabel value="node" control={<Radio />} label="Node.js" />
            <FormControlLabel value="express" control={<Radio />} label="Express" />
          </RadioGroup>
        </div>

        <div className="Ta(s) Bgc(#9e001c) ">
          <div className="P(8px)">Location:</div>
          <RadioGroup className="Px(8px)" aria-label="Technology" name="technology" onChange={handleLocationSearch}>
            <FormControlLabel value="san+francisco" control={<Radio />} label="San Francisco" />
            <FormControlLabel value="new+york" control={<Radio />} label="New York" />
            <FormControlLabel value="houston" control={<Radio />} label="Houston" />
            <FormControlLabel value="chicago" control={<Radio />} label="Chicago" />
          </RadioGroup>
        </div>

        </div>
        <Paper className="W(80%)">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Harvest Score</TableCell>
                <TableCell  align="left">Company Name</TableCell>
                <TableCell align="left">Job Title</TableCell>
                <TableCell align="left">Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map(row => {
                return (
                  <TableRow key={row._id} className="Cur(p) Bgc(#e6f2fa):h" onClick={() => openOverlay(row._source)}>
                    <TableCell align="center">
                      <span className="Fz(18px) Fw(b)" style={{color: row.score >= 80 ? 'green' : 'red'}}>{row.score}</span>
                    </TableCell>
                    <TableCell align="left">
                      {row._source.job_company_name || 'Unable to Scrape'}
                    </TableCell>
                    <TableCell align="left">{row._source.job_title || 'Unable to Scrape' }</TableCell>
                    <TableCell align="left">{row._source.job_location || 'Unable to Scrape'}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </div>
  );
}
