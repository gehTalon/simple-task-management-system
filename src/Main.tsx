import * as React from 'react';
import Calendar from 'react-awesome-calendar';
import List from './List';
import Timer from './Timer';
import Actionlog from './Actionlog';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import './Main.css';
interface Events
{
    id: number;
    title: string;
    color: string;
    from: string;
    to: string;
    status:number;
    timespent:string;
}

interface ActionLogs
{
    id: number,
    title: string,
    date_event:string,
    timespent:string,
    task_id:string,
}

interface IState { 
  
    events:Events[], 
    actionLogs:ActionLogs[],
    filteredEvents:Events[],
    calendarEvents:Events[],
    task_selected:Events[],
    dateFrom: string,
    logDate:string,
    logTitle:string,
    dateTo: string,
    monCheck: boolean,
    tueCheck: boolean,
    wedCheck: boolean,
    thuCheck: boolean,
    friCheck: boolean,
    satCheck: boolean,
    sunCheck: boolean,
    colorSelect: string,
    btnSelected: string,
    title:string,
    searchQuery:string,
    isRecurring:boolean,
    currentPage:string
    logHour:string,
    logMin:string,
    logSec:string,
    selectedLogID:number,
    selectedCurrentTimeSpent:string,
    actionTotalSpent:string
}





class Main extends React.Component<any, IState> {
 
    
  constructor(props) {
        super(props);
        this.state = { 
            events: [],
            actionLogs:[],
            filteredEvents:[],
            task_selected: [],
            calendarEvents:[],
            dateFrom: "",
            logDate:"",
            logTitle:"",
            dateTo: "",
            monCheck: false,
            tueCheck: false,
            wedCheck: false,
            thuCheck: false,
            friCheck: false,
            satCheck: false,
            sunCheck: false,
            colorSelect: 'red',
            btnSelected: 'btn-primary',
            title:'',
            searchQuery:'',
            isRecurring:false,
            currentPage:"dashboard",
            logHour:"00",
            logMin:"00",
            logSec:"00",
            selectedLogID:0,
            selectedCurrentTimeSpent:"",
            actionTotalSpent:""
      } 
  }
  
    log_action_events = (events = [] as object) =>{
     
        return fetch('https://codingchallenge.jabezonline.net/laravel/public/api/events/tasklog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({
              "events" : events
            })
        })
            .then((response) => response.json()) 
            .then((result) => {
      
               this.clearFields();
          
            })
            .catch((error) => {
                console.error(error);
        });
    }
   
    save_events = (events = [] as object) =>{
     
      return fetch('https://codingchallenge.jabezonline.net/laravel/public/api/events/store', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body:JSON.stringify({
            "events" : events
          })
      })
          .then((response) => response.json()) 
          .then((result) => {
    
             this.clearFields();
        
          })
          .catch((error) => {
              console.error(error);
      });
      
      
    }

    clearFields(){
      this.setState({dateFrom:'' as string,dateTo:''  as string,title:''  as string})
    }

    clearData = () =>{
     
      fetch("https://codingchallenge.jabezonline.net/laravel/public/api/delete/all")
      .then(res => res.json())
      .then(
        (result) => {
          
         
          this.setState({events:[]},() =>this.filterList())
        },
       
        (error) => {
           
        }
      )
    } 

    task_log_from_list = (eventID = 0 as number | string,current_time_spent = "" as string,time_log = "" as string) =>{
        var start = new Date(this.state.logDate);
        var time_value = this.addTimes(current_time_spent,time_log);
        var index = this.state.events.findIndex(obj => obj.id === eventID);
        this.state.events[index].timespent = time_value;     


        var dYear = start.getFullYear();
        var dMonth = start.getMonth() + 1;
        var dDay = start.getDate();
    

        var logContainer : Array<{
            id: number, 
            title: string,
            date_event: string,
            timespent: string,
            total_time_value:string,
            task_id: number | string,
        }> = [];

        logContainer.push({
            id:0,
            title: this.state.logTitle,
            date_event: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
            timespent: time_log,
            total_time_value:time_value,
            task_id:eventID,
        });
        this.log_action_events(logContainer);
        this.filterList();
    }

    task_log  = (eventID = 0 as number | string,current_time_spent = "" as string,time_log = "" as string,action_l = "" as string) =>{
        var start = new Date();
        var time_value = this.addTimes(current_time_spent,time_log);

        var index = this.state.events.findIndex(obj => obj.id === eventID);
        this.state.events[index].timespent = time_value;  
        
        var dYear = start.getFullYear();
        var dMonth = start.getMonth() + 1;
        var dDay = start.getDate();

        var logContainer : Array<{
            id: number, 
            title: string,
            date_event: string,
            timespent: string,
            total_time_value:string,
            task_id: number | string,
        }> = [];

        logContainer.push({
            id:0,
            title: action_l,
            date_event: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
            timespent: time_log,
            total_time_value:time_value,
            task_id:eventID,
        });
        this.log_action_events(logContainer);
        
        this.filterList();
        this.task_activity(eventID,0);
        this.setState({task_selected:[]});
    }

    task_complete_from_list = (eventID = 0 as number | string) =>{
        fetch("https://codingchallenge.jabezonline.net/laravel/public/api/update/"+eventID+"/complete")
        .then(res => res.json())
        .then(
            (result) => {
            
                this.task_activity(eventID,3);
            }, 
        
            (error) => {
            
            }
        )
    }

    task_complete = (eventID = 0 as number | string,current_time_spent = "" as string,time_log = "" as string,action_l = "" as string) =>{
        var start = new Date();
        var time_value = this.addTimes(current_time_spent,time_log);

        var index = this.state.events.findIndex(obj => obj.id === eventID);
        this.state.events[index].timespent = time_value;  
        
        var dYear = start.getFullYear();
        var dMonth = start.getMonth() + 1;
        var dDay = start.getDate();

        var logContainer : Array<{
            id: number, 
            title: string,
            date_event: string,
            timespent: string,
            total_time_value:string,
            task_id: number | string,
        }> = [];

        logContainer.push({
            id:0,
            title: action_l,
            date_event: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
            timespent: time_log,
            total_time_value:time_value,
            task_id:eventID,
        });
        this.log_action_events(logContainer);

        
        fetch("https://codingchallenge.jabezonline.net/laravel/public/api/update/"+eventID+"/complete")
        .then(res => res.json())
        .then(
            (result) => {
            
                this.filterList();
                this.task_activity(eventID,3);
                this.setState({task_selected:[]});
            }, 
        
            (error) => {
            
            }
        )
    }

    delete_timer = (eventID = 0 as number | string) =>{
        this.task_activity(eventID,0);
        this.setState({task_selected:[]});
      }

    start_task = (eventID: object) =>{
      if(this.state.task_selected.length > 0)
      {
        alert('You are currently working on a task. Log or delete the current timer and try again.')
      }
      else
      {
        this.task_activity(eventID['id'],1);
      

        var eventContainer : Array<{
          id: number, 
          title: string,
          color: string,
          from: string,
          to: string, 
          status:number,
          timespent:string;
        }> = [];   
      
         eventContainer.push({
            id:eventID['id'],
            title:eventID['title'],
            color:eventID['color'],
            from:eventID['from'],
            to:eventID['to'],
            status:0,
            timespent:eventID['timespent'],
          });
          this.setState({task_selected:eventContainer});
      }
      
    }

    task_activity = (eventID = 0 as number | string,act = 0 as number) => {
       var index = this.state.events.findIndex(obj => obj.id === eventID);
       this.state.events[index].status = act;     
       
       this.filterList();
       
    }

    logTime = (eventID = 0 as number,current_time_spent = "" as string) =>{
   
        this.setState({selectedLogID:eventID,selectedCurrentTimeSpent:current_time_spent});
     
       
    }
   
    remove_event = (eventID = 0 as number | string) =>{
   
      fetch("https://codingchallenge.jabezonline.net/laravel/public/api/delete/"+eventID)
      .then(res => res.json())
      .then(
        (result) => {
          
         
          this.setState({ 
            events: this.state.events.filter(item => item.id !== eventID)
          },() =>this.filterList());
        }, 
       
        (error) => {
          
        }
      )
    }

    get_tasks_actions = (eventID = 0 as number,totalSpentTime = "" as string) =>{
        this.setState({actionLogs:[],actionTotalSpent:totalSpentTime})
        fetch("https://codingchallenge.jabezonline.net/laravel/public/api/events/actionlogs/"+eventID)
        .then(res => res.json())
        .then(
          (result) => {
            
            for (let events of result) {
                
              this.state.actionLogs.push(events);
             
            }
            this.setState({actionLogs:this.state.actionLogs})
          },
         
          (error) => {
           
          }
        )
    }


    send_to_server = () =>{
     
      fetch("https://codingchallenge.jabezonline.net/laravel/public/api/events")
      .then(res => res.json())
      .then(
        (result) => {
          
          for (let events of result) {
              
            this.state.events.push(events);
           
          }
          this.setState({events:this.state.events},() =>this.filterList())
        },
       
        (error) => {
         
        }
      )
    }

    componentDidMount(){
         this.send_to_server();

         console.log(this.state.task_selected);
    }

  

    addCalendarEvent() {
        var start = new Date(this.state.dateFrom);
        var end = new Date(this.state.dateTo);

        if(this.state.isRecurring)
        {
              
                var eventContainer : Array<{
                    id: number, 
                    title: string,
                    color: string,
                    from: string,
                    to: string,
                    status:number,
                    timespent:string;
                }> = [];
                
                var loop = new Date(start);
                var ctr = 0;
                while(loop <= end){
                
                var newDate = loop.setDate(loop.getDate() + 1);
                loop = new Date(newDate);
                var dYear = loop.getFullYear();
                var dMonth = loop.getMonth() + 1;
                var dDay = loop.getDate();
                switch (loop.getDay()) {
                    case 0:
                    
                    if(this.state.sunCheck)
                    {
                        eventContainer.push({
                        id:ctr,
                        color: this.state.colorSelect,
                        from: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                        to: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                        title: this.state.title,
                        status:0,
                        timespent:"00:00:00"
                        });
                    }
                    break;
                    case 1:
                    if(this.state.monCheck)
                    {
                    
                        eventContainer.push({
                        id:ctr,
                        color: this.state.colorSelect,
                        from: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                        to: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                        title: this.state.title,
                        status:0,
                        timespent:"00:00:00"
                        });
                    }
                    break;
                    case 2:
                    if(this.state.tueCheck)
                    {
                        eventContainer.push({
                        id:ctr,
                        color: this.state.colorSelect,
                        from: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                        to: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                        title: this.state.title,
                        status:0,
                        timespent:"00:00:00"
                        });
                    }
                    break;
                    case 3:
                    if(this.state.wedCheck)
                    {
                        eventContainer.push({
                        id:ctr,
                        color: this.state.colorSelect,
                        from: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                        to: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                        title: this.state.title,
                        status:0,
                        timespent:"00:00:00"
                        });
                    }
                    break;
                    case 4:
                    if(this.state.thuCheck)
                    {
                        eventContainer.push({
                        id:ctr,
                        color: this.state.colorSelect,
                        from: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                        to: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                        title: this.state.title,
                        status:0,
                        timespent:"00:00:00"
                        });
                    }
                    break;
                    case 5:
                    if(this.state.friCheck)
                    {
                        eventContainer.push({
                        id:ctr,
                        color: this.state.colorSelect,
                        from: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                        to: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                        title: this.state.title,
                        status:0,
                        timespent:"00:00:00"
                        });
                    }
                    break;
                    case 6:
                    if(this.state.satCheck)
                    {
                        eventContainer.push({
                        id:ctr,
                        color: this.state.colorSelect,
                        from: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                        to: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                        title: this.state.title,
                        status:0,
                        timespent:"00:00:00"
                        });
                    }
                }
        
                
                ctr++;
                }
                this.setState({events:this.state.events.concat(eventContainer)},() =>this.filterList());
            
                this.save_events(eventContainer);
        }
        else
        {
                var eventContainer2 : Array<{
                    id: number, 
                    title: string,
                    color: string,
                    from: string,
                    to: string,
                    status:number,
                    timespent:string
                }> = [];
    
                
                var dYear = start.getFullYear();
                var dMonth = start.getMonth() + 1;
                var dDay = start.getDate();
    
                
                var eYear = end.getFullYear();
                var eMonth = end.getMonth() + 1;
                var eDay = end.getDate();
    
                eventContainer2.push({ 
                id:0,
                color: this.state.colorSelect,
                from: dYear+'-'+('0' + dMonth).slice(-2)+'-'+('0' + dDay).slice(-2)+'T18:00:00+00:00',
                to: eYear+'-'+('0' + eMonth).slice(-2)+'-'+('0' + eDay).slice(-2)+'T19:00:00+00:00',
                title: this.state.title,
                status:0,
                timespent:"00:00:00"
                });
                this.setState({events:this.state.events.concat(eventContainer2)},() =>this.filterList());
                
                this.save_events(eventContainer2);
        }
        
    }

    onDateFrom = (e: React.FormEvent<HTMLInputElement>): void => {
      this.setState({dateFrom:e.currentTarget.value})
    }
    onDateLog  = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({logDate: e.currentTarget.value})
    }
    onLogTitle = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({logTitle: e.currentTarget.value})
    }
    onDateTo = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({dateTo: e.currentTarget.value})
    }

    onTitle = (e: React.FormEvent<HTMLInputElement>): void =>{
      this.setState({title: e.currentTarget.value})
    }

    onlogHour = (e: React.FormEvent<HTMLInputElement>): void =>{
        this.setState({logHour: ('0' + e.currentTarget.value).slice(-2)})
    }
    onlogMin = (e: React.FormEvent<HTMLInputElement>): void =>{
        this.setState({logMin: ('0' + e.currentTarget.value).slice(-2)})
    }
    onlogSec = (e: React.FormEvent<HTMLInputElement>): void =>{
        this.setState({logSec: ('0' + e.currentTarget.value).slice(-2)})
    }


    daysCheck(event = "" as any ,days: React.FormEvent<HTMLInputElement>) {
      const target = days.currentTarget;
     
      switch (event) {
        case 0:
          this.setState({sunCheck:target.checked})
          break;
        case 1:
          this.setState({monCheck:target.checked})
          break;
        case 2:
          this.setState({tueCheck:target.checked})
          break;
        case 3:
          this.setState({wedCheck:target.checked})
          break;
        case 4:
          this.setState({thuCheck:target.checked})
          break;
        case 5:
          this.setState({friCheck:target.checked})
          break;
        case 6:
          this.setState({satCheck:target.checked})
      }
    }
    
  
    seachEvents = (e: React.FormEvent<HTMLInputElement>): void =>{
      const q = e.currentTarget.value.toLowerCase();
      this.setState({ searchQuery : q}, () => this.filterList());
    }
  
    filterList() {
      let listEvents = this.state.events;
      let calenderE = this.state.events;
      let q = this.state.searchQuery; 

     
  
      listEvents = listEvents.filter(function(list) {
        return list.title.toLowerCase().indexOf(q) != -1; 
      });

      calenderE = listEvents.filter(function(list) {
        return list.status != 3;
      });
      this.setState({ filteredEvents: listEvents,calendarEvents:calenderE });

    
    }
  

    addTimes (startTime = 0 as any, endTime = 0 as any) {
        var times = [ 0, 0, 0 ]
        var max = times.length;
        var a = (startTime || '').split(':');
        var b = (endTime || '').split(':');
        for (var i = 0; i < max; i++) {
          a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
          b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
        }
        for (var i = 0; i < max; i++) {
          times[i] = a[i] + b[i]
        }
      
        var hours = times[0]
        var minutes = times[1]
        var seconds = times[2]
      
        if (seconds >= 60) {
          var m = (seconds / 60) << 0
          minutes += m
          seconds -= 60 * m
        }
      
        if (minutes >= 60) {
          var h = (minutes / 60) << 0
          hours += h
          minutes -= 60 * h
        }
      
        return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
      }
   
    list_sort(sortBy = "from" as string)
    {
        switch (sortBy) { 
            case "from":
                this.setState({ filteredEvents: this.state.filteredEvents.sort((a, b) => a.from.localeCompare(b.from)) });
            break;
            case "status":
                this.setState({ filteredEvents: this.state.filteredEvents.sort(
                    function(a, b) {
                        if(a.status < b.status) return -1;
                        return 0;
                       }
                ) });
            break;
            case "to":
                this.setState({ filteredEvents: this.state.filteredEvents.sort((a, b) => a.to.localeCompare(b.to)) });
            break;
            case "title":
                this.setState({ filteredEvents: this.state.filteredEvents.sort(
                    function(a, b) {
                        if(a.title.toLowerCase() < b.title.toLowerCase()) return -1;
                        if(a.title.toLowerCase() > b.title.toLowerCase()) return 1;
                        return 0;
                       }
                ) });
            break;
           
          }
    }
 
    render() {
        return (
        <div className="profile">
                      <div className="profile-header">
                        
                          <div className="profile-header-cover"></div>
                        
                          <div className="profile-header-content">
                          
                            <div className="profile-header-img">
                                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="" />
                            </div>
                             
                            <div className="profile-header-info">
                                <h4 className="m-t-10 m-b-5">Reggie Dawal</h4>
                                <p className="m-b-10">Frontend Developer</p>
                               
                                <div className="col-sm-12 action-events">
                                    <button type="button" className="btn btn-info new-events" data-toggle="modal" data-target="#myModal" >Create New Tasks</button>
                                    <button type="button" className="btn btn-danger clear-events" onClick={(e) => { if (window.confirm('Are you sure you want to clear all your Events?')) this.clearData() } } >Clear All Tasks</button>
                                   
                                </div>  

                            </div>
                          
                          </div>
                          <ul className="profile-header-tab nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link  active show"id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true" onClick={ () => { this.setState({currentPage:'dashboard'}) }}>Dashboard</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link"  id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false" onClick={ () => { this.setState({currentPage:'list'}) }}>Tasks List</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link"  id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false" onClick={ () => { this.setState({currentPage:'calendar'}) }}>Calendar</a>
                                </li>
                                </ul>

                        
                        
                      </div>
                     
                  
                    <div className="profile-content">
                    <div className="row">

                              <div className="modal fade" id="actionLog" role="dialog">
                                <div className="modal-dialog">
                            
                            
                                    <div className="modal-content"> 
                                    <div className="modal-header">
                                    <h2>Action Log</h2>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    
                                    </div>
                                    <div className="modal-body"> 
                                            <table className="table table-striped">
                                                <thead>
                                                <tr>
                                                    <th>Action</th>
                                                    <th>Date</th>
                                                    <th>Time Spent</th>
                                                   
                                                </tr>
                                                </thead>
                                                <tbody> 
                                                {      
                                                      this.state.actionLogs.map((events) =>
                                                            
                                                        <Actionlog actions={events} />
                                                        )
                                    
                                                } 
                                                 <tr className="result-info">
                                                    <td className="bg-info"></td>      
                                                    <td className="bg-info">Total Time Spent:</td>     
                                                    <td className="bg-info">{this.state.actionTotalSpent}</td>           
                                                        
                                                </tr>
                                            </tbody>
                                            </table>   
                                    </div>
                                   
                                    </div>
                                    
                                </div>
                                </div> 
              
           
                                <div className="modal fade" id="logForm" role="dialog">
                                <div className="modal-dialog">
                            
                            
                                    <div className="modal-content"> 
                                    <div className="modal-header">
                                    <h2>Log Time</h2>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    
                                    </div>
                                    <div className="modal-body"> 
                                    <div className="col-12" > 
                                    <form>
                                        <div className="form-row">
                                            <div className="col-12">
                                            <div className="form-group">
                                                <label>What is the description or action you want to log?</label>
                                                <input type="text" className="form-control" value={this.state.logTitle}  onChange={this.onLogTitle.bind(this)} placeholder="" />
                                            </div>
                                            </div>
                                            <div className="col-12"> 
                                            <div className="form-group">
                                                <label >Date</label>
                                                <input type="date" id="" value={this.state.logDate}  onChange={this.onDateLog.bind(this)} className="form-control"  name="dateFrom" />
                                            </div>
                                            </div>
                                        
                                            <div className="form-group"> 
                                            <label >Time Spent</label> 
                                            <div className="form-row">  
                                                <div className="col">
                                                <label >Hour</label> 
                                                <input type="number" min="0"  value={this.state.logHour}   onChange={this.onlogHour.bind(this)} max="99" className="form-control" placeholder="Hour" /> 
                                                </div>
                                                <div className="col">
                                                <label >Minute</label>
                                                <input type="number"  min="0" value={this.state.logMin}   onChange={this.onlogMin.bind(this)}  max="59"  className="form-control" placeholder="Minute" /> 
                                                </div>
                                                <div className="col">
                                                <label >Second</label>
                                                <input type="number" min="0"  value={this.state.logSec}   onChange={this.onlogSec.bind(this)}  max="59" className="form-control" placeholder="Second" /> 
                                                </div>
                                            </div>
                                                    
                                            </div>
                                            
                                        
                                        </div>
                                        </form>
                                    </div>
                                    </div>
                                    <div className="modal-footer">
                                            <div className="form-group btn-block mt-10"> 
                                                <button type="button" className={"btn btn-block btn-primary"} 
                                                onClick={(e) => { if (window.confirm('Are you sure you want to log this time?')) this.task_log_from_list(this.state.selectedLogID,this.state.selectedCurrentTimeSpent,('0' + this.state.logHour).slice(-2) +":"+ ('0' + this.state.logMin).slice(-2)  +":"+ ('0' + this.state.logSec).slice(-2)) } }
                                                data-dismiss="modal" >Save</button>
                                                </div>
                                    </div>
                                    </div>
                                    
                                </div>
                                </div> 
                    
                                <div className="modal fade" id="myModal" role="dialog">
                                <div className="modal-dialog">
                            
                            
                                    <div className="modal-content">
                                    <div className="modal-header">
                                    <h2>Create Tasks</h2>
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    
                                    </div>
                                    <div className="modal-body">
                                    <div className="col-12" >
                                    <form>
                                            <div className="input-group mb-3">
                                                <div className="form-group">
                                                <label >Is Recurring Task?</label>  
                                                
                                                <input type="checkbox"  value={1} onChange={ () => { this.setState({isRecurring:!this.state.isRecurring}) }}/> 
                                                
                                                </div>
                                            <div className="form-group">
                                                <label >What needs to be done?</label>
                                                <input type="text" value={this.state.title}   onChange={this.onTitle.bind(this)}  className="form-control" id="" />
                                                </div>
                                                <br />
                                                <div className="form-group">
                                                <label >Start Date</label>
                                                <input type="date" id="" value={this.state.dateFrom}  onChange={this.onDateFrom.bind(this)} className="form-control"  name="dateFrom" />
                                                </div>
                                                <div className="form-group">
                                                {
                                                this.state.isRecurring == true ?
                                                <label >End Date</label>
                                                    :
                                                <label >Due Date</label>

                                                }
                                                
                                                <input type="date" id="" value={this.state.dateTo}  onChange={this.onDateTo.bind(this)} className="form-control"  name="dateTo" />
                                                </div>
                                            {
                                                this.state.isRecurring == true ?
                                                <div className="form-group">
                                                    <label >Recur this task every</label>
                                                    <div className="input-group-prepend mb-3">
                                                    <div className="input-group-text">
                                                        <span className="input-group-text"><input type="checkbox"  value={1} onChange={this.daysCheck.bind(this,1)} /> Mon</span>
                                                    </div>
                                                    <div className="input-group-text">
                                                        <span className="input-group-text"><input type="checkbox" value={1} onChange={this.daysCheck.bind(this,2)}/> Tue</span>
                                                    </div>
                                                    <div className="input-group-text">
                                                        <span className="input-group-text"><input type="checkbox" value={1} onChange={this.daysCheck.bind(this,3)} /> Wed</span>
                                                    </div>
                                                    <div className="input-group-text">
                                                        <span className="input-group-text"><input type="checkbox" value={1} onChange={this.daysCheck.bind(this,4)} /> Thu</span>
                                                    </div>
                                                    <div className="input-group-text">
                                                        <span className="input-group-text"><input type="checkbox" value={1} onChange={this.daysCheck.bind(this,5)} /> Fri</span>
                                                    </div>
                                                    <div className="input-group-text">
                                                        <span className="input-group-text"><input type="checkbox" value={1} onChange={this.daysCheck.bind(this,6)} /> Sat</span>
                                                    </div>
                                                    <div className="input-group-text">
                                                        <span className="input-group-text"><input type="checkbox"  value={1} onChange={this.daysCheck.bind(this,0)} /> Sun</span>
                                                    </div>
                                                    
                                                    </div> 
                                                </div>   
                                                :
                                                null
                                                }  
                                                <div className="form-group">
                                                <label >Priority of this Tasks</label>
                                                <br />
                                                <div className="input-group-prepend mb-3">
                                                    <div className="input-group-text">
                                                    <span className="input-group-text input-group-text-priority bg-danger">
                                                        <input type="radio" value={1} onClick={ () => { this.setState({colorSelect:'red'}) }} name="priority" /> High
                                                        
                                                    </span>
                                                    </div>
                                                    <div className="input-group-text">
                                                    <span className="input-group-text input-group-text-priority bg-primary">
                                                        <input type="radio" value={1} onClick={ () => { this.setState({colorSelect:'blue'}) }} name="priority" /> Medium
                                                        
                                                    </span>
                                                    </div>
                                                    <div className="input-group-text">
                                                    <span className="input-group-text input-group-text-priority" style={{backgroundColor:'gray'}}>
                                                        <input type="radio" value={1} onClick={ () => { this.setState({colorSelect:'gray'}) }} name="priority" /> Low
                                                        
                                                    </span>
                                                </div>
                                                    <div className="input-group-text">
                                                    <span className="input-group-text input-group-text-priority bg-success">
                                                        <input type="radio" value={1} onClick={ () => { this.setState({colorSelect:'green'}) }} name="priority" /> None
                                                        
                                                    </span>
                                                    </div>
                                                </div>
                                                

                                                </div>

                                            
                                               
                                            
                                            
                                            
                                            </div>
                                    </form>
                                    </div>
                                    </div>
                                    <div className="modal-footer">
                                            <div className="form-group btn-block mt-10"> 
                                                <button type="button" data-dismiss="modal" className={"btn btn-block "+ this.state.btnSelected}  onClick ={ ()=>  this.addCalendarEvent() }>Save</button>
                                            </div>
                                    </div>
                                    </div>
                                    
                                </div>
                            </div> 
                             
                            
                            <div className="col-12 col-sm-12 calendarWrapper ">
                                <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                    <div className="form-row" style={{marginTop:50}}>
                                        <div className="col">
                                        
                                            <HighchartsReact
                                            highcharts={Highcharts}
                                            options={
                                                {
                                                    chart: {
                                                        plotBackgroundColor: null,
                                                        plotBorderWidth: null,
                                                        plotShadow: false,
                                                        type: 'pie'
                                                    },   
                                                    colors: [  
                                                        'gray',
                                                        'green',
                                                        
                                                    ],
                                                    title: {
                                                        text: ''
                                                    },
                                                    tooltip: {
                                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                                    },
                                                    plotOptions: {
                                                        pie: {
                                                            allowPointSelect: true,
                                                            cursor: 'pointer',
                                                            dataLabels: {
                                                                enabled: true,
                                                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                                            }
                                                        }
                                                    },
                                                    series: [{
                                                        name: 'Tasks',
                                                        colorByPoint: true, 
                                                        data: [{
                                                            name: 'Pending',
                                                            y: this.state.events.filter(list => 
                                                                list.status != 3).length
                                                        
                                                        }, {
                                                            name: 'Completed',
                                                            y: this.state.events.filter(list => 
                                                                list.status === 3).length
                                                        }]
                                                    }]
                                                } 
                                            }
                                        />   
                                        </div>    
                                        <div className="col">
                                        
                                            <HighchartsReact
                                            highcharts={Highcharts}
                                            options={
                                                {
                                                    chart: {
                                                        plotBackgroundColor: null,
                                                        plotBorderWidth: null,
                                                        plotShadow: false,
                                                        type: 'column'
                                                    },   
                                                    colors: [  
                                                        'gray',
                                                        'green',
                                                        
                                                    ],
                                                    title: {
                                                        text: ''
                                                    },
                                                    tooltip: {
                                                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                                    },
                                                    plotOptions: {
                                                        pie: {
                                                            allowPointSelect: true,
                                                            cursor: 'pointer',
                                                            dataLabels: {
                                                                enabled: true,
                                                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                                            }
                                                        }
                                                    },
                                                    series: [{
                                                        name: 'Pending',
                                                        data: [this.state.events.filter(list => 
                                                            list.status != 3).length]
                                                
                                                    }, {
                                                        name: 'Completed',
                                                        data:[ this.state.events.filter(list => 
                                                            list.status === 3).length ]
                                                
                                                    }]
                                                }  
                                            }
                                        />   


                                        </div>  
                                        <div className="col">
                                            <HighchartsReact
                                            highcharts={Highcharts}
                                            options={{
                                                chart: {
                                                    type: 'bar'
                                                },
                                                colors: [
                                                    'gray',
                                                    'green',
                                                    
                                                ],
                                                title: {
                                                    text: ''
                                                },
                                                subtitle: {
                                                    text: ''
                                                },
                                                xAxis: {
                                                    categories: ['High','Medium','Low','None'],
                                                    title: {
                                                        text: null
                                                    }
                                                },
                                                yAxis: {
                                                    min: 0,
                                                    title: {
                                                        text: '',
                                                        align: 'high'
                                                    },
                                                    labels: {
                                                        overflow: 'justify'
                                                    }
                                                },
                                                tooltip: {
                                                    valueSuffix: ''
                                                },
                                                plotOptions: {
                                                    bar: {
                                                        dataLabels: {
                                                            enabled: true
                                                        }
                                                    }
                                                }, 
                                                
                                                credits: {
                                                    enabled: false
                                                },
                                                series: [{
                                                    name: 'Pending Tasks by Priority',
                                                    data: [
                                                        this.state.events.filter(list => list.status != 3 && list.color === 'red').length,
                                                        this.state.events.filter(list => list.status != 3 && list.color === 'blue').length,
                                                        this.state.events.filter(list => list.status != 3 && list.color === 'gray').length,
                                                        this.state.events.filter(list => list.status != 3 && list.color === 'green').length,
                                                    ]
                                                },
                                                {
                                                    name: 'Completed Tasks by Priority',
                                                    data: [
                                                        this.state.events.filter(list => list.status === 3 && list.color === 'red').length,
                                                        this.state.events.filter(list => list.status === 3 && list.color === 'blue').length,
                                                        this.state.events.filter(list => list.status === 3 && list.color === 'gray').length,
                                                        this.state.events.filter(list => list.status === 3 && list.color === 'green').length,
                                                    ]
                                                }
                                                ] 
                                            }}
                                        />  
                                        </div>
                                    
                                    </div> 
                                    
                                </div>
                                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                   <div className="form-group"> 
                                                <input type="text" value={this.state.searchQuery} placeholder="Search by tasks title"  onChange={this.seachEvents.bind(this)}  className="form-control" id="" />
                                    </div>
                                    <div className="calendar-events" style={{marginTop:50}}>
                                            <ul className="list-group">
                                                <li className="list-group-item">
                                                    None 
                                                    <span className="badge">{this.state.events.filter(list => list.status != 3 && list.color === 'green').length}</span>
                                                </li>
                                                <li className="list-group-item">
                                                    Low 
                                                    <span className="badge">{this.state.events.filter(list => list.status != 3 && list.color === 'gray').length}</span>
                                                </li>
                                                <li className="list-group-item">
                                                    Medium 
                                                    <span className="badge">{this.state.events.filter(list => list.status != 3 && list.color === 'blue').length}</span>
                                                </li>
                                            
                                                <li className="list-group-item">
                                                    High 
                                                    <span className="badge">{this.state.events.filter(list => list.status != 3 && list.color === 'red').length}</span>
                                                </li>
                                            
                                                <li className="list-group-item">
                                                    Pending 
                                                    <span className="badge">{ this.state.events.filter(list => list.status != 3).length}</span>
                                                </li>
                                                <li className="list-group-item">
                                                    Completed 
                                                    <span className="badge">{ this.state.events.filter(list => list.status === 3).length}</span>
                                                </li>
                                            </ul>
                                        {
                                            this.state.filteredEvents.length > 0 ?
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th onClick={ () => { this.list_sort("title") }} style={{width:'20%'}}>Tasks</th>
                                                        <th onClick={ () => { this.list_sort("from") }}>Start Date</th>
                                                        <th onClick={ () => { this.list_sort("to") }}> Due Date</th>
                                                        <th>Priority</th>
                                                        <th>Time Spent</th>
                                                        <th onClick={ () => { this.list_sort("status") }} >Status</th>
                                                        <th style={{width:'35%'}}></th>
                                                    </tr>
                                                </thead>
                                                <tbody> 
                                                    {      
                                                            this.state.filteredEvents.map((events) =>
                                                                
                                                            <List list={events} startEvent={this.start_task} get_tasks_actions={this.get_tasks_actions} taskComplete={this.task_complete_from_list} logTime={this.logTime} removeEvent={this.remove_event} />
                                                            )
                                                    } 
                                                 </tbody>
                                            </table>   
                                            :
                                            <p className="report-display"><span className="thickText">You have no tasks</span></p>
                                        }
                                        
                                    </div>           
                                </div>
                                <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                                </div>
                                </div>                    

                                {
                                    this.state.currentPage == "calendar" ?
                                    <div className="col-12 col-sm-12" >
                                    
                                        <Calendar
                                            events={this.state.calendarEvents}
                                            headerRender={{mode: "dailyMode"}}
                                            />
                                        
                                    </div>
                                    :
                                    null
                                }
                            </div>
                            <div id="footer" className="col-sm-7 col-12"> 
                                            {  
                                                
                                                this.state.task_selected.length > 0 ?
                                                
                                                this.state.task_selected.map((events,index) =>
                                                    
                                                <Timer key={index} list={events} activity={this.task_activity} task_log={this.task_log} task_complete={this.task_complete} delete_timer={this.delete_timer}/>
                                        
                                        
                                                 )
                                            :
                                                null
                                    
                                            }  
                            </div>
                            </div>
                    </div>
          </div>
          
        )
    } 
}

export default Main;

