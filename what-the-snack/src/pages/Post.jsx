import React, { useState, useRef, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Button from '../components/common/Button'
import { v4 as uuidv4 } from 'uuid'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { addPosts, modifyPosts } from '../api/posts'
import useInput from '../hooks/useInput'

const Post = () => {
  const navigate = useNavigate();
  const location = useLocation()

  const [form, setForm] = useState({
    author: '',
    title: '',
    body: '',
    url: '',
  })
  
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');

  const authorRef = useRef(null);
  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const urlRef = useRef(null);

  useEffect(() => {
    if (location.state !== null) {
      // setAuthor(location.state.author);
      // setTitle(location.state.title);
      // setBody(location.state.body);
      // setUrl(location.state.url);
      setForm({
        ...form,
        author: location.state.author,
        title: location.state.title,
        body: location.state.body,
        url: location.state.url,
      });
      // return () => {
      //   setAuthor('');
      //   setTitle('');
      //   setBody('');
      //   setUrl('');
      // }
    }
  }, []);

  const onFormChangeHandler = useCallback((e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }, []);

  // const onChangeAuthorhandler = useCallback((e) => {
  //   setAuthor(e.target.value);
  // }, [])

  // const onChangeTitlehandler = useCallback((e) => {
  //   setTitle(e.target.value);
  // }, [])

  // const onChangeBodyhandler = useCallback((e) => {
  //   setBody(e.target.value);
  // }, [])

  // const onChangeUrlhandler = useCallback((e) => {
  //   setUrl(e.target.value);
  // }, [])


  const queryClient = useQueryClient();
  const addPostsMutation = useMutation(addPosts, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    }
  })

  const modifyPostsMutation = useMutation(modifyPosts, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
    }
  })

  const onSubmitClickHandler = (e) => {
    e.preventDefault();
    if (author === '' || title == '' || body == '' || url == '') {
      alert('양식을 모두 입력해주세요.');
      return;
    };

    const newPost = {
      id: uuidv4(),
      author,
      title,
      body,
      like: 0,
      url,
    }
    addPostsMutation.mutate(newPost);
  }

  if(addPostsMutation.isSuccess) {
    console.log('성공', addPostsMutation.data);
    alert(`게시글 등록이 완료되었습니다!`);
    navigate(-1);
  }

  if(addPostsMutation.isError) {
    console.log('에러', addPostsMutation.error);
    alert(`게시글 등록 중 오류가 발생했습니다.`);
  }

  const onmodifyClickHandler = (e) => {
    e.preventDefault();
    modifyPostsMutation.mutate({
      id: location.state.id,
      author,
      title,
      body,
      url,
    });
  }

  if(modifyPostsMutation.isSuccess) {
    console.log('성공', modifyPostsMutation.data);
    alert(`게시글 수정이 완료되었습니다!`);
    navigate(-1);
  }

  if(modifyPostsMutation.isError) {
    console.log('에러', modifyPostsMutation.error);
    alert(`게시글 수록 중 오류가 발생했습니다.`);
  }

  const onListLinkClickHandler = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  return (
    <>
      <Header />
      <main>
        <div>
          <MainContentForm>
            <Label htmlFor="author">작성자</Label>
            <Input
              type="text"
              name="author"
              id="author"
              // value={author}
              value={form.author}
              // onChange={onChangeAuthorhandler}
              onChange={onFormChangeHandler}
              maxLength={10}
              ref={authorRef}
            />
            <Label htmlFor="title">제목</Label>
            <Input
              type="text"
              name="title"
              id="title"
              // value={title}
              value={form.title}
              // onChange={onChangeTitlehandler}
              onChange={onFormChangeHandler}
              maxLength={12}
              ref={titleRef}
            />
            <Label htmlFor="body">내용</Label>
            <Textarea
              name="body"
              id="body"
              rows="10"
              // value={body}
              value={form.body}
              // onChange={onChangeBodyhandler}
              onChange={onFormChangeHandler}
              maxLength={250}
              ref={bodyRef}
            >
            </Textarea>
            <Label htmlFor="url">이미지 URL</Label>
            <Input
              type="url"
              name="url"
              id="url"
              // value={url}
              value={form.url}
              // onChange={onChangeUrlhandler}
              onChange={onFormChangeHandler}
              ref={urlRef}
            />
            <MainContentBtnDiv>
              <Button type="button" size={'small'} color={'white'} onClick={onListLinkClickHandler}>
                뒤로가기
              </Button>
              {
                location.state !== null ?
                  <Button type="button" size={'small'} color={'red'} onClick={onmodifyClickHandler}>수정하기</Button>
                  : <Button type="button" size={'small'} color={'red'} onClick={onSubmitClickHandler}>작성하기</Button>
              }
            </MainContentBtnDiv>
          </MainContentForm>
        </div>
      </main>
      <Footer />
    </>
  )
}

const MainContentForm = styled.form`
  width: 60vh;
  margin: 30px auto;
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  margin: 20px 0;
  font-size: 20px;
  font-weight: bold;
`

const Input = styled.input`
  height: 20px;
  border: none;
  border-bottom: 1px solid #000;
  `

const Textarea = styled.textarea`
  border: none;
  border-bottom: 1px solid #000;
  resize: none;
`

const MainContentBtnDiv = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 10px;
`

export default Post