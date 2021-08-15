import React from 'react';


  
  type Props = {
    delete_timer: (id:  number) => void, 
    task_complete:(id:  number,current_time_spent:string,timelog:  string,action_l: string) => void,
    activity:(id:  number,act:  number) => void,
    task_log:(id:  number,current_time_spent:string,timelog:  string,action_l: string) => void,
    list:{
        id: number, 
        title: string,
        color: string, 
        from: string,
        to: string, 
        status:number,
        timespent:string,
    },  
  };
  
  type State = {
    seconds: number,
    minutes:number,
    hours:number,
    pause: number,
    pause_color:string,
    formHeight:number,
    formShow:boolean,
    action_log:string
  };

  
  const initialState = {
    seconds: 0,
    minutes: 0,
    hours: 0,
    pause: 0,
    pause_color:'#ffffff',
    formHeight:57,
    formShow:false,
    action_log:""
};
var timer;

  class Timer extends React.Component <Props,State>{
    constructor(props) {
        super(props);

        this.state = initialState;
        
    }

    view_form()
    {
        if(this.state.formShow)
        {
            this.setState({formHeight:57,formShow:false});
        }
        else
        {
            this.setState({formHeight:190,formShow:true});
        }
    }
    
    pause_timer()
    { 
        if(this.state.pause == 0)
        {
            this.setState({pause:1});
            this.props.activity(this.props.list.id,2);
        }
        else
        {
            this.props.activity(this.props.list.id,1);
            this.setState({pause:0,pause_color:'#ffffff'});
        }
       
    }
    
    timer_task(){
					  
          
                if(this.state.pause == 0)
                {
                    this.setState({seconds: this.state.seconds + 1});				  
                    if(this.state.seconds >= 60){
                       
                        this.setState({minutes: this.state.minutes + 1,seconds:0});	
                       
                        
                        if(this.state.minutes >= 60)
                        {
                            this.setState({hours: this.state.hours + 1,minutes:0});	
                       
                           
                        }
                        
                         
                    }
                }
                else
                {
                    if(this.state.pause_color == "#ffffff")
                    {
                         
                        this.setState({pause_color:'red'});
                    }
                    else
                    {
                        this.setState({pause_color:'#ffffff'});
                    }
                    
                   
                }
                 
    }

    action_log = (e: React.ChangeEvent<HTMLTextAreaElement>): void =>{
        this.setState({action_log:  e.currentTarget.value})
    }

    componentDidMount(){
        timer = setInterval(() => this.timer_task(), 1000);
        
    }

    myStopFunction() {
        clearTimeout(timer);
        this.setState({
            seconds: 0,
            minutes: 0,
            hours: 0,
        });
      }
  
    render() {
                  
                  
     
      return ( 
  <form>      	
  <div className="region region-page-bottom">
  
  
  
  <div>
  <div className="timer-wrapper" style={{height:this.state.formHeight}}>
    <ul className="timer-ul">
      <li>	
        <a href="#" className="btn btn-info btn-lg" onClick={() => { this.pause_timer() } }>
             {
                  this.state.pause == 1 ?
                  <span className="icon-pause"  >
              
                        Continue Timer
                 </span>
                  :
                  <span className="icon-pause"  >
              
                  Pause Timer
                  </span>
              }
         </a>
          <a href="#" className="btn btn-info btn-lg view_log_form" style={{marginLeft:-3}}>
            <span className="task_timer_display" style={{color:this.state.pause_color}}>{('0' + this.state.hours).slice(-2)} : {('0' + this.state.minutes).slice(-2)} : {('0' + this.state.seconds).slice(-2)}</span>
          </a>
          <a href="#" className="link-primary" onClick={() => { this.view_form() } }>
            <span style={{fontWeight:'bold',marginLeft:20}} className="view_log_form">
             {this.props.list.title}
               
                
                {
                  this.state.formShow ?
                  <i className="fa fa-sort-desc" style={{fontSize:40,marginRight:25,float:'right'}} />
                  :
                  <i className="fa fa-sort-asc" style={{fontSize:40,marginRight:25,marginTop:15,float:'right'}} />
                 }
               
            </span>
           </a>
        
        <div style={{height:115,marginTop:5,borderTop:'1px solid rgb(234, 234, 234)'}}> 
          <textarea className="timerDescription" placeholder="What action did you do?" value={this.state.action_log}  onChange={this.action_log.bind(this)} ></textarea>
          <a href="#" className="btn btn-info btn-lg" style={{marginLeft:2}}  onClick={(e) => { if (window.confirm('Are you sure you want to log this time?')) this.props.task_log(this.props.list.id,this.props.list.timespent,('0' + this.state.hours).slice(-2) +":"+ ('0' + this.state.minutes).slice(-2)  +":"+ ('0' + this.state.seconds).slice(-2),this.state.action_log) } }>
            <span id="" className="timerLogText" >Log Time</span>
          </a>
          <a href="#" className="btn btn-success btn-lg timer_delete"  onClick={(e) => { if (window.confirm('Are you sure this task is complete?')) this.props.task_complete(this.props.list.id,this.props.list.timespent,('0' + this.state.hours).slice(-2) +":"+ ('0' + this.state.minutes).slice(-2)  +":"+ ('0' + this.state.seconds).slice(-2),this.state.action_log) } } >
            <span className="timerLogText">Task Complete and Log Time</span>
          </a>
          <a href="#" className="btn btn-danger btn-lg timer_delete"  onClick={(e) => { if (window.confirm('Are you sure you want to stop this timer without logging?')) this.props.delete_timer(this.props.list.id) } } >
            <span className="timerLogText">Delete Timer</span></a></div></li></ul>
    </div>
  
  </div>
  </div>
  </form>
      )
  
    }
  }

  export default Timer;