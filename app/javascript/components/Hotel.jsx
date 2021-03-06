import React, {Fragment} from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import Rater from 'react-rating'
import ImageGallery from 'react-image-gallery';

export default class Hotel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hotel: this.props.hotel,
      review: '',
      reviewRating: 0
    };
  }

  handleInputChange = (field, value) => {
    this.setState({[field]: value})
  }

  submitReview = () => {
    $.ajax({
      url: `/hotels/${this.state.hotel.id}/reviews.json`,
      type: 'POST',
      data: {
        review: {
          rating: this.state.reviewRating,
          comment: this.state.review
        }
      },
      success: (resp) => {
        window.location.reload()
      }
    });
  }

  deleteReview = (id) => {
    if(confirm('Видалити відгук?')) {
      $.ajax({
        url: `/hotels/${this.state.hotel.id}/reviews/${id}.json`,
        type: 'DELETE',
        success: (resp) => {
          window.location.reload()
        }
      });
    }
  }

  render() {
    console.log(this.state)
    const images = this.state.hotel.photos.map((photo) => {
      return (
        { original: photo,
          thumbnail: photo})})
    return (
      <div className="container">
        <ImageGallery items={images} additionalClass='custom-gallery' />
        <hr/>
        <div className='row'>
          <div className='col-lg-9'>
            <div className='hotel-header'>
              <h2>{this.state.hotel.name}</h2>
              <span>{this.state.hotel.price} UAH</span>
            </div>
            <div className='hotel-description'>
              <span dangerouslySetInnerHTML={{__html: this.state.hotel.description}}></span>
            </div>
          </div>
          <div className='col-lg-3 left-border text-center'>
            <div className='rating'>
              <Rater initialRating={parseFloat(this.state.hotel.googleRating)} emptySymbol="fa fa-star-o fa-2x"
                     fullSymbol="fa fa-star fa-2x" readonly className='hotel-stars'/>
              <span className='rating-number'>{this.state.hotel.googleRating}</span>
            </div>
            <div className='phones'>
              { this.state.hotel.phones.map((phone, i) => {
                return (
                  <div className='phone' key={i}>
                    {phone}
                  </div>
                )})}
            </div>
            <div className='hotel-buttons text-center'>
              { this.state.hotel.site &&
                <a className='btn btn-default' href={this.state.hotel.site} target="_blank">Офіційний сайт</a>}
              <a className='btn btn-dark' href={this.state.hotel.location} target="_blank">3D карта</a>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-9'>
            <div className='reviews-wrap'>
              <div className='review-form'>
                <textarea type='text' rows='3' onChange={(e) => this.handleInputChange('review', e.target.value)} value={this.state.review} className='form-control'/>
                <div className='review-actions'>
                  <button className='btn btn-dark' onClick={this.submitReview} disabled={this.state.reviewRating == 0}>Залишити відгук</button>
                  <Rater start={0} stop={5} step={1} onClick={(rate) => this.handleInputChange('reviewRating', rate)} emptySymbol="fa fa-star-o fa-2x"
                         fullSymbol="fa fa-star fa-2x" className='hotel-stars' initialRating={this.state.reviewRating}/>
                </div>
              </div>
              <div className='reviews'>
                { this.state.hotel.googleReviews.map((review, i) => {
                  return (
                    <Fragment>
                      <hr/>
                      <div className='review' key={i}>
                        <div className={ review.id ? 'round-image-200' : '' }><img className='review-avatar' src={review.avatar} alt={review.author} /></div>
                        <div className='review-content'>
                          <div className='content-top'>
                            <div className='left'>
                              <span className='author'>{review.author}</span>
                              <span className='date'>{review.created}</span>
                            </div>
                            <div className='right'>
                              <Rater initialRating={parseInt(review.rating, 10)} emptySymbol="fa fa-star-o"
                                     fullSymbol="fa fa-star" readonly className='hotel-stars'/>
                              { review.destroyable && <i className='fa fa-trash-o' onClick={() => this.deleteReview(review.id)}/>}
                            </div>
                          </div>
                          <div className='review-body'>
                            {review.text}
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  )})}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
