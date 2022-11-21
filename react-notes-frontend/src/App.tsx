import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useMemo, useState } from "react"
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

export type Tag = {
  _id: string
  label: string
}

function App() {
  const [notes, setNotes] = useState<RawNote[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag._id)), id: note._id }
    })
  }, [notes, tags])

  async function getNotes() {
    //console.log("network request")
    let response = await fetch(`http://localhost:5000/notes/`);

    if (!response.ok) {
      let message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    let notes = await response.json();
    setNotes(notes);
  }

  async function getTags() {
    //console.log("network request for tags")
    let response = await fetch(`http://localhost:5000/tags/`);

    if (!response.ok) {
      let message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    let tags = await response.json();
    //console.log(tags)
    setTags(tags);
  }

  useEffect(() => {
    getNotes()
  }, [notes.length])
  useEffect(() => {
    getTags()
  }, [tags.length])

  async function onCreateNote({ tags, ...data }: NoteData) {
    try {
      let resp = await fetch("http://localhost:5000/notes/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    console.log(id);
    console.log({ ...data, tagIds: tags.map(tag => tag._id), id: id })
    try {
      let resp = await fetch(`http://localhost:5000/notes/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      let resp = await fetch(`http://localhost:5000/notes/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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
      let resp = await fetch("http://localhost:5000/tags/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    //console.log("in update tag");
    //console.log(id)
    try {
      let resp = await fetch("http://localhost:5000/tags/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, label: label }),
      })
      let jsonResp = await resp.json()
      //console.log(resp)
      await getTags()
    } catch (error) {
      window.alert(error);
    }
  }

  async function deleteTag(id: string) {
    //console.log(id)
    try {
      let resp = await fetch(`http://localhost:5000/tags/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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
  )
}

export default App
