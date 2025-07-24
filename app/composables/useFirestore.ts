import { ref, readonly } from 'vue'
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
  type QueryConstraint
} from 'firebase/firestore'
import { useFirebase } from './useFirebase'

export const useFirestore = () => {
  const { db } = useFirebase()
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createDocument = async (collectionName: string, data: DocumentData) => {
    loading.value = true
    error.value = null
    
    try {
      const docRef = await addDoc(collection(db, collectionName), data)
      return { id: docRef.id, error: null }
    } catch (err: any) {
      error.value = err.message
      return { id: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const getDocument = async (collectionName: string, docId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, collectionName, docId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() }, error: null }
      } else {
        return { data: null, error: 'Document not found' }
      }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const getCollection = async (collectionName: string, constraints: QueryConstraint[] = []) => {
    loading.value = true
    error.value = null
    
    try {
      const q = constraints.length > 0 
        ? query(collection(db, collectionName), ...constraints)
        : collection(db, collectionName)
      
      const querySnapshot = await getDocs(q)
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      return { data: documents, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: [], error: err.message }
    } finally {
      loading.value = false
    }
  }

  const updateDocument = async (collectionName: string, docId: string, data: Partial<DocumentData>) => {
    loading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, collectionName, docId)
      await updateDoc(docRef, data)
      return { error: null }
    } catch (err: any) {
      error.value = err.message
      return { error: err.message }
    } finally {
      loading.value = false
    }
  }

  const deleteDocument = async (collectionName: string, docId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, collectionName, docId)
      await deleteDoc(docRef)
      return { error: null }
    } catch (err: any) {
      error.value = err.message
      return { error: err.message }
    } finally {
      loading.value = false
    }
  }

  const isAdmin = async (uid: string) => {
    const { data, error } = await getDocument('users', 'admins')
    
    if (error || !data) {
      return false
    }
    
    // Type assertion for admin document structure
    const adminData = data as { id: string; superadmin?: string; admins?: string[] }
    
    // Check if user is superadmin
    if (adminData.superadmin === uid) {
      return true
    }
    
    // Check if user is in admins array
    if (adminData.admins && Array.isArray(adminData.admins)) {
      return adminData.admins.includes(uid)
    }
    
    return false
  }

  const queryWhere = (field: string, operator: any, value: any) => where(field, operator, value)
  const queryOrderBy = (field: string, direction: 'asc' | 'desc' = 'asc') => orderBy(field, direction)
  const queryLimit = (limitCount: number) => limit(limitCount)

  return {
    loading: readonly(loading),
    error: readonly(error),
    createDocument,
    getDocument,
    getCollection,
    updateDocument,
    deleteDocument,
    isAdmin,
    queryWhere,
    queryOrderBy,
    queryLimit
  }
}