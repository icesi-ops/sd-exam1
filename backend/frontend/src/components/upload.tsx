import * as React from "react";

export class FileSelector extends React.Component{
    constructor(props: any){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (selectorFiles: FileList | null) => {
        console.log(selectorFiles?.item(0));
    }

    render = () => {
        return <div>
            <input type="file" onChange={ (e) => this.handleChange(e.target.files) } />
        </div>;
    }
}