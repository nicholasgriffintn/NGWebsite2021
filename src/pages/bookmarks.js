import { useState } from 'react';
import styles from '../styles/Page.module.css';
import PageLayout from '../components/pageLayout';
import { useAppContext } from '../context/store';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';

import BookmarksWidget from '../widgets/Bookmarks';
import BookmarksAdminWidget from '../widgets/BookmarksAdmin';

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgb(23 25 35 / 66%)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgb(23 25 35)',
    width: '90%',
    maxWidth: '780px',
  },
};

Modal.setAppElement('#modal-root');

export default function Page() {
  const { alreadyLoggedIn } = useAppContext();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <PageLayout
      title="Bookmarks"
      hideContent={true}
      showHero={false}
      loadingState={false}
      darkMain={false}
    >
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Edit Bookmark"
      >
        <h2>Submit a Bookmark</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Title:</label>
            <input {...register('title', { required: true })} />
            {errors.title && <span>A title is required</span>}
          </div>
          <div>
            <label>Description:</label>
            <textarea
              cols="6"
              {...register('description', { required: true })}
            />
            {errors.description && <span>A description is required</span>}
          </div>
          <div>
            <label>URL:</label>
            <input {...register('url', { required: true })} />
            {errors.url && <span>A url is required</span>}
          </div>

          <br></br>

          <input
            style={{
              marginRight: '10px',
            }}
            className="button button-prime"
            type="submit"
          />
          <button
            type="button"
            className="button button-prime-inverted"
            onClick={() => closeModal()}
          >
            Cancel
          </button>
        </form>
      </Modal>
      <div className="standard-page-content">
        <div className={styles['flex-grid']}>
          <div
            className={styles.col}
            style={{ maxWidth: '980px', width: '100%', margin: '0 auto' }}
          >
            <h1>Bookmarks</h1>
            <p>Would you like to suggest a bookmark for me to look at?</p>
            <p>
              <button
                type="button"
                className="button button-prime-inverted"
                onClick={() => openModal()}
              >
                Submit a Bookmark
              </button>
            </p>
            {alreadyLoggedIn === true ? (
              <div className="admin-block">
                <h2>Bookmarks Admin</h2>
                <BookmarksAdminWidget limit={100} />
                <hr></hr>
              </div>
            ) : null}
            <BookmarksWidget limit={100} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
