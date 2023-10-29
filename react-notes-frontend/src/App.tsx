import "bootstrap/dist/css/bootstrap.min.css"
import { Dispatch, SetStateAction, createContext, useEffect, useMemo, useState } from "react"
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import { NewNote } from "./NewNote"
import { NoteList } from "./NoteList"
import { NotesLayout } from "./NotesLayout"
import { Note } from "./Note"
import { Editnote } from "./EditNote"
export type Note = {
  id: string
} & NoteData

export type RawNote = {
  _id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type User = {
  userName: string,
  email: string
}

export type Tag = {
  _id: string
  label: string
}

export type userContextType = {
  user?: User
  setUser?: Dispatch<SetStateAction<User | undefined>>
}

export const CurrentUserContext = createContext<userContextType>({});

function App() {
  const [notes, setNotes] = useState<RawNote[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [currentUser, setCurrentUser] = useState<User>();

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag._id)), id: note._id }
    })
  }, [notes, tags])

  async function getNotes() {
    //console.log("network request")
    let authToken = localStorage.getItem("authToken");
    if (!authToken) return
    try {
      let resp = await fetch('https://localhost:5000/api/notes/', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        credentials: "include",
      });
      if (resp.status !== 200)
        throw new Error("Something went wrong");
      let respJson = await resp.json();
      let notes = respJson as RawNote[];
      setNotes(notes);

    } catch (error) {
      window.alert(error);
    }
  }

  async function getTags() {
    //console.log("network request for tags")
    let authToken = localStorage.getItem("authToken");
    if (!authToken) return
    try {
      let resp = await fetch('https://localhost:5000/api/tags/', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        credentials: "include",
      });
      if (resp.status !== 200)
        throw new Error("Something went wrong");
      let respJson = await resp.json();
      let tags = respJson as Tag[];
      setTags(tags);

    } catch (error) {
      window.alert(error);
    }
  }

  useEffect(() => {
    getNotes()
  }, [notes.length, currentUser])
  useEffect(() => {
    getTags()
  }, [tags.length, currentUser])

  async function onCreateNote({ tags, ...data }: NoteData) {
    try {
      let authToken = localStorage.getItem("authToken");
      if (!authToken) return
      let resp = await fetch("https://localhost:5000/api/notes/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        credentials: "include",
        body: JSON.stringify({ ...data, tagIds: tags.map(tag => tag._id) }),
      })
      await getTags()
      await getNotes()
    } catch (error) {
      window.alert(error);
      return;
    }
  }

  async function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    //console.log(id);
    //console.log({ ...data, tagIds: tags.map(tag => tag._id), id: id })
    try {
      let authToken = localStorage.getItem("authToken");
      if (!authToken) return
      let resp = await fetch(`https://localhost:5000/api/notes/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        credentials: "include",
        body: JSON.stringify({ ...data, tagIds: tags.map(tag => tag._id), id: id }),
      })
      let jsonResp = await resp.json()
      // console.log(jsonResp)
      await getTags()
      await getNotes()
    } catch (error) {
      window.alert(error);
      return;
    }
  }

  async function onDeleteNote(id: string) {
    //console.log(id)
    try {
      let authToken = localStorage.getItem("authToken");
      if (!authToken) return
      let resp = await fetch(`https://localhost:5000/api/notes/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        credentials: "include",
        body: JSON.stringify({ id: id }),
      })
      let jsonResp = await resp.json()
      //console.log(jsonResp)
      await getNotes()
    } catch (error) {
      window.alert(error);
      return;
    }

  }

  async function addTag(label: string) {
    try {
      let authToken = localStorage.getItem("authToken");
      if (!authToken) return
      let resp = await fetch("https://localhost:5000/api/tags/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        credentials: "include",
        body: JSON.stringify({ label: label }),
      })
      let jsonResp = await resp.json()
      return jsonResp.insertedId;
    } catch (error) {
      window.alert(error);
      return '';
    }
  }

  async function updateTag(id: string, label: string) {
    try {
      let authToken = localStorage.getItem("authToken");
      if (!authToken) return
      let resp = await fetch("https://localhost:5000/api/tags/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        credentials: "include",
        body: JSON.stringify({ id: id, label: label }),
      })
      let jsonResp = await resp.json()
      await getTags()
    } catch (error) {
      window.alert(error);
    }
  }

  async function deleteTag(id: string) {
    //console.log(id)
    try {
      let authToken = localStorage.getItem("authToken");
      if (!authToken) return
      let resp = await fetch(`https://localhost:5000/api/tags/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        credentials: "include",
        body: JSON.stringify({ id: id }),
      })
      let jsonResp = await resp.json()
      // console.log(jsonResp)
      await getTags()
    } catch (error) {
      window.alert(error);
      return;
    }
  }

  return (
    <CurrentUserContext.Provider value={{ user: currentUser, setUser: setCurrentUser }}>
      <Container className="my-4">
        <Routes>
          <Route path="/" element={<NoteList availableTags={tags} notes={notesWithTags}
            deleteTag={deleteTag} updateTag={updateTag} />} />
          <Route path="/new" element={<NewNote
            onSubmit={onCreateNote}
            onAddTag={addTag}
            availableTags={tags}
          />}
          />
          <Route path="/:id" element={<NotesLayout notes={notesWithTags} />} >
            <Route index element={<Note onDeleteNote={onDeleteNote} />} />
            <Route path="edit" element={<Editnote
              onSubmit={onUpdateNote}
              onAddTag={addTag}
              availableTags={tags} />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </CurrentUserContext.Provider>
  )
}

export default App
