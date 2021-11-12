import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from 'baseui/modal';

import { useDispatch } from 'react-redux';

import { H2, H3, H5, H6 } from 'baseui/typography';
import { Input } from 'baseui/input';
import { Select } from 'baseui/select';
import { TokenExpiredError } from 'jsonwebtoken';
import toast from 'react-hot-toast';
import { Button } from 'baseui/button';
import { Col, Row } from 'react-bootstrap';
import axiosConfig from '../../axiosConfig';

import Plus from 'baseui/icon/plus';

const Carousel = require('react-responsive-carousel').Carousel;

function ShowDishModal(props) {
  const dispatch = useDispatch();
  const [conflictModalIsOpen, setConflictModalIsOpen] = useState(false);

  const {
    dishModalIsOpen,
    setDishModalIsOpen,
    dishes,
    selectedDishId,
    restId,
    restName,
  } = props;

  console.log(restId);
  const [dishImages, setDishImages] = useState([]);
  const [dishDetails, setDishDetails] = useState({});
  const [prevRestName, setPrevRestName] = useState('');
  const [prevRestId, setPrevRestId] = useState('');

  useEffect(() => {
    if (dishes && selectedDishId) {
      let selectedDish = dishes.filter((dish) => dish._id === selectedDishId);
      if (selectedDish.length > 0) {
        setDishImages(selectedDish[0].imageLink);
        setDishDetails(selectedDish);
      }
    }
  }, [selectedDishId, dishes]);

  const resetCartItems = () => {
    const token = localStorage.getItem('token');
    axiosConfig
      .post(
        '/cart/reset',
        {
          dishId: selectedDishId,
          restId,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      )
      .then((res) => {
        toast.success('Cart Updated');
        setDishModalIsOpen(false);
      })
      .catch((err) => {
        toast.error('Error Updating Cart');
      });
  };

  const addItemToCart = () => {
    const token = localStorage.getItem('token');
    axiosConfig
      .post(
        '/cart/add',
        {
          resId: restId,
          dishId: selectedDishId,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      )
      .then((res) => {
        console.log(res.data);
        toast.success('Item Added To Cart');
        setDishModalIsOpen(false);
      })
      .catch((err) => {
        if (err.response.status === 409) {
          setConflictModalIsOpen(true);
          setPrevRestName(err.response.data.restName);
          setPrevRestId(err.response.data.restId);
        }
      });
  };

  return (
    <div>
      <Modal
        onClose={() => setConflictModalIsOpen(false)}
        isOpen={conflictModalIsOpen}
      >
        <ModalHeader style={{ textAlign: 'left' }}>
          <H3>Create new order?</H3>
        </ModalHeader>
        <ModalBody>
          <h6>
            Your order contains items from "{prevRestName}". Create a new order
            to add items from "{restName}"
          </h6>
        </ModalBody>
        <ModalFooter>
          <ModalButton
            kind="tertiary"
            onClick={() => setConflictModalIsOpen(false)}
          >
            Cancel
          </ModalButton>
          <ModalButton
            onClick={() => {
              resetCartItems();
              setConflictModalIsOpen(false);
            }}
          >
            Create
          </ModalButton>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={dishModalIsOpen}
        closeable
        size="35%"
        onClose={() => setDishModalIsOpen(false)}
      >
        {/* <ModalHeader> Edit Dish Details</ModalHeader> */}
        {/* <Row style={{ marginLeft: "5%" }}>
          <Col>
            <Carousel showArrows showThumbs={false}>
              {dishImages?.length > 0
                ? dishImages.map((ele) => (
                    <div style={{ height: "200px" }}>
                      <img src={ele.di_img} style={{ borderRadius: "20px" }} />
                    </div>
                  ))
                : null}
            </Carousel>
          </Col>
          <Col>
            
          </Col>
        </Row> */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Carousel showArrows showThumbs={false} width="100%">
            {dishImages?.length > 0
              ? dishImages.map((ele) => (
                  <img src={ele.imageLink} style={{ borderRadius: '20px' }} />
                ))
              : null}
          </Carousel>
        </div>
        <div style={{ textAlign: 'left', marginLeft: '5%', marginTop: '2%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '95%',
            }}
          >
            <H5>{dishDetails ? dishDetails[0]?.name : ''}</H5>
            <H5>${dishDetails ? dishDetails[0]?.price : ''}</H5>
          </div>
          <hr />
          <h6>Description:</h6>
          <h6>
            <div style={{ color: 'gray' }}>
              {dishDetails ? dishDetails[0]?.description : ''}
            </div>
          </h6>
          <h6>Ingredients:</h6>
          <h6>
            <div style={{ color: 'gray' }}>
              {dishDetails ? dishDetails[0]?.ingredients : ''}
            </div>
          </h6>
        </div>
        <hr />
        <ModalFooter>
          <Row style={{ marginTop: '-25px' }}>
            <Col style={{ textAlign: 'left', marginTop: '10px' }}>
              <h5>
                {dishDetails ? dishDetails[0]?.category + ' - ' : ''}
                {dishDetails ? dishDetails[0]?.type : ''}
              </h5>
            </Col>
            <Col>
              <Button
                startEnhancer={() => <Plus size={24} />}
                onClick={() => addItemToCart()}
              >
                {' '}
                Add to Cart
              </Button>
            </Col>
          </Row>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ShowDishModal;
