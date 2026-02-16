import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      name
      role
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const CREATE_AUTHOR_MUTATION = gql`
  mutation CreateAuthor($input: CreateAuthorInput!) {
    createAuthor(input: $input) {
      id
      firstName
      lastName
      birthDate
      biography
      nationality
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_AUTHOR_MUTATION = gql`
  mutation UpdateAuthor($id: ID!, $input: UpdateAuthorInput!) {
    updateAuthor(id: $id, input: $input) {
      id
      firstName
      lastName
      birthDate
      biography
      nationality
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PUBLISHER_MUTATION = gql`
  mutation CreatePublisher($input: CreatePublisherInput!) {
    createPublisher(input: $input) {
      id
      name
      address
      city
      country
      website
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PUBLISHER_MUTATION = gql`
  mutation UpdatePublisher($id: ID!, $input: UpdatePublisherInput!) {
    updatePublisher(id: $id, input: $input) {
      id
      name
      address
      city
      country
      website
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_BOOK_MUTATION = gql`
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) {
      id
      title
      isbn
      publicationDate
      price
      description
      pageCount
      language
      publisherId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BOOK_MUTATION = gql`
  mutation UpdateBook($id: ID!, $input: UpdateBookInput!) {
    updateBook(id: $id, input: $input) {
      id
      title
      isbn
      publicationDate
      price
      description
      pageCount
      language
      publisherId
      createdAt
      updatedAt
    }
  }
`;
