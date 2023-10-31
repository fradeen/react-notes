import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import { NewNote } from "./pages/NewNote"
import { NoteData, NoteList } from "./pages/NoteList"
import { NoteDetails } from "./pages/NoteDetails"
import { Editnote } from "./pages/EditNote"
import { AuthProvider } from "./components/AuthProvider"
function App() {

  return (
    <AuthProvider>
      <Container className="my-4">
        <Routes>
          <Route path="/" element={<NoteList />} />
          <Route path="/new" element={<NewNote />} />
          <Route path="/:id" >
            <Route index element={<NoteDetails />} />
            <Route path="edit" element={<Editnote />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </AuthProvider>
  )
}

export default App
