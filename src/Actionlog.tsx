import * as React from 'react';



interface Props {
   
      actions:{
        id: number, 
        title: string,
        date_event: string, 
        timespent: string,
        task_id: string, 
       
    }, 
  }
  
   
  
  
  class Actionlog extends React.Component<Props> {
    constructor(props: any) {
      super(props)
    }

    

    render() {
        var fTemp = new Date(this.props.actions.date_event) as any;
        fTemp = fTemp.setDate(fTemp.getDate() - 1);
        fTemp = new Date(fTemp);
      return ( 
        <tr>
              <td>{this.props.actions.title}</td>      
              <td>{ fTemp.toDateString() }</td>     
              <td>{this.props.actions.timespent}</td>           
                  
        </tr>
      )
  
    }
  }

  export default Actionlog;