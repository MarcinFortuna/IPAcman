import React from 'react';

export class Square extends React.Component {
  render() {
    let square_content = this.props.ipa ? this.props.ipa : ""
    return (
      <td className={this.props.classname}>{square_content}</td>
    )
  }
}
