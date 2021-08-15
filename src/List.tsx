import * as React from 'react';



interface Props {
    removeEvent: (p: number) => void, 
    logTime: (p: number,current_time_spent:string) => void, 
    startEvent: (p: object) => void, 
    taskComplete: (p: number) => void, 
    get_tasks_actions: (p: number,totalSpentTime:string) => void, 
      list:{
        id: number, 
        title: string,
        color: string, 
        from: string,
        to: string, 
        status:number,
        timespent:string,
    }, 
  }
  
   
  
  
  class List extends React.Component<Props> {
    constructor(props: any) {
      super(props)
    }

    check_status(s = 0 as number)
    {
      switch(s) {
        case 1:
          return 'Working....';
        case 2:
          return 'Timer pause';
        case 3:
          return 'Completed';
        default:
          return 'Pending';
      }
    }

    render() {
      var fTemp = new Date(this.props.list.from) as any;
      fTemp = fTemp.setDate(fTemp.getDate() - 1);
      fTemp = new Date(fTemp);
  
      var tTemp = new Date(this.props.list.to) as any;
      tTemp = tTemp.setDate(tTemp.getDate() - 1);
      tTemp = new Date(tTemp);
     
      return ( 
        <tr>
                    <td>
                       <a href="#" className="link-primary"  data-toggle="modal" data-target="#actionLog"
                         onClick={(e) => { this.props.get_tasks_actions(this.props.list.id,this.props.list.timespent) } } 
                        >
                          {this.props.list.title}
                        </a>
                    </td>
                    <td>{ fTemp.toDateString() }</td>
                    <td>{ tTemp.toDateString() }</td>
                    
                    <td>
                    <button type="button" className="btn btn-danger"  style={{backgroundColor:this.props.list.color}} >
                                  
                                  </button>
                    </td>
                 
                    <td> 
                      {
                        this.props.list.timespent
                      }
                    </td>

                    <td> 
                      {
                        this.check_status(this.props.list.status)
                      }
                    </td>
                   
                    {
                       this.props.list.status == 0 ?
                      <td> 
                       <button type="button" className="btn btn-info log-events"
                      data-toggle="modal" data-target="#logForm"
                      onClick={(e) => { this.props.logTime(this.props.list.id,this.props.list.timespent) } } 
                      >
                      
                      Log Time  
                      </button>
                      <button type="button" className="btn btn-danger log-events"
                      onClick={(e) => { if (window.confirm('Are you sure you want to remove this task?')) this.props.removeEvent(this.props.list.id) } } 
                      >
                      Remove    
                      </button>
                      <button type="button" className="btn btn-primary log-events"
                          onClick={(e) => { if (window.confirm('Start working this tasks?')) this.props.startEvent(this.props.list) } } 
                        >
                        Start Task 
                      </button>
                      <button type="button" className="btn btn-success log-events"
                          onClick={(e) => { if (window.confirm('Are you sure this task is complete?')) this.props.taskComplete(this.props.list.id) } } 
                        >
                         Complete
                      </button> 
                      </td> 
                      :  
                      <td> 
                      <button type="button" className="btn btn-info log-events"
                      data-toggle="modal" data-target="#logForm"
                      onClick={(e) => { this.props.logTime(this.props.list.id,this.props.list.timespent) } } 
                      >
                      Log Time  
                      </button>
                      
                      </td>
                    }
                    
                    
                    
                    
                  
        </tr>
      )
  
    }
  }

  export default List;