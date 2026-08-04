export type Role = 'STUDENT' | 'ADMIN' | 'TEACHER' | 'SUPPORT'

export interface Student {
    id: string
    role: Role
    type_id: string
    username: string
    full_name: string
    is_active: boolean
    active_term: number
    phone_number: string
}

export interface StudentEdit {
    role: Role;
    type_id: string;
    username: string;
    password: string;
    full_name: string;
    is_active: boolean;
    active_term: number;
    phone_number: string;
    access?: boolean;
    open_lesson_count: number
}

export interface Course {
    id: string
    title: string
    level: string
    type_id: string
    image_url: string
    description: string
    is_active?: boolean
    created_at?: string
}

export interface CourseEdit {
    title: string
    level: string
    type_id: string
    image_url: string
    is_active: boolean
    description: string
}

export interface Module {
    id: string
    title: string
    order: number
    description: string
}

export interface ModuleEdit {
    title: string
    order: number
    description: string
}

export interface Lesson {
    id: string
    title: string
    order: number
    content: string
    duration: string
    video_url: string
    cover_url: string
    description: string
    lesson_test_progress: {
        is_completed: boolean
    }
}

export interface LessonPayload {
    title: string
    order: number
    content: string
    duration: string
    video_url: string
    cover_url: string
    description: string
    lesson_test_progress?: {
        is_completed: boolean
    }
}

export interface ModulePayload {
    title: string
    order: number
    description: string
}

export type User = {
    id: string
    role: Role
    username: string
    full_name: string
}

export interface StoredAuth {
    user_id: string
    type_id: string
    full_name: string
    access_token: string
    role: Role
}

export interface MenuItem {
    name: string
    href: string
    icon: React.ReactNode
}

export interface Type {
    id: string
    title: string
    description: string
}

export interface TypeEdit {
    title: string
    description: string
}

export interface Course {
  id: string;
  category: string;
  title: string;
  description: string;
  rating: string;
  reviews: number;
  price: number;
  imageUrl: string;
}

export interface CourseContent {
    id: string
    title: string
    content_url: string
    description: string
}

export interface CourseContentEdit {
    title?: string
    content_url?: string
    description?: string
}

export interface Lesson{
        id: string,
      course_module_id: string,
      title: string,
      description: string,
      video_url: string,
      content: string,
      duration: string,
      order: number,
      cover_url: string,
      is_active: boolean,
      created_at: string,
    //   "lesson_test_progress": {
    //     "id": 1258,
    //     "student_id": 3,
    //     "lesson_id": 11,
    //     "is_completed": true,
    //     "best_score": 9,
    //     "created_at": "2026-03-22 17:36:27"}
}

export interface LessonMaterial {
    id: string
    title: string
    description: string
    material_url: string
}

export interface LessonMaterialPayload {
    title: string
    description: string
    material_url: string
}

export type NotificationTYPE = "SUCCSESS" | "INFO" | "WARNING" | "ERROR"

export interface Notification {
    id: string
    title: string
    message: string
    is_global: boolean
    created_at: string
    type: NotificationTYPE
}

export interface NotificationPayload {
    title: string
    message: string
    is_global: boolean
    type: NotificationTYPE
}

export interface Question {
    id: string | number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
    lesson_id: number;
}

type QuestionBase = {
    question_text: string
    option_a: string
    option_b: string
    option_c: string
    option_d: string
    correct_option: string
}

type QuestionWithLesson = QuestionBase & {
    lesson_id: number
    module_id?: never
}

type QuestionWithModule = QuestionBase & {
    module_id: number
    lesson_id?: never
}

export type QuestionEdit = QuestionWithLesson | QuestionWithModule

export interface Message {
    id: number
    is_read: boolean
    message: string
    sender_role: Role
    ticket_id: number
    created_at: string
    updated_at: string;
    file_path?: string
    sender_id: number | string
}

export interface Ticket {
    id: number;
    student_id: string;
    created_at: string;
    updated_at: string;
    status: 'ALL' | 'OPEN' | 'CLOSED';
    student: {
        type_id: 2
        role: string
        username: string
        full_name: string
        phone_number: string
    }
    last_message: {
        created_at: string
        file_path: string
        id: number
        is_read: boolean
        message: string
        sender_id: number
        sender_role: Role
        ticket_id: number
        unread_count: number
    }
}

export type FetchTicketsResponse =
    | {
        status: 'ok'
        tickets: Ticket[]
        unread_count: number
    }
    | {
        status: 'error'
        message: string
    }

export type FetchTicketsResponse2 =
    | {
        status: 'ok'
        ticket_id: number
    }
    | {
        status: 'error'
        message: string
    }

export type FetchMessagesResponse =
    | {
        status: 'ok'
        messages: Message[]
    }
    | {
        status: 'error'
        message: string
    }


export interface News {
    id: string
    title: string,
    content: string,
    file_url: string,
    image_url: string,
    description: string,
    created_at: string,
    updated_at: string,
}

export interface NewsEdit {
    content: string,
    description: string,
    file_url: string,
    image_url: string,
    title: string
}
