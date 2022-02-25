
import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { EmptyObject } from 'apollo-angular/types';
import { Observable } from 'rxjs';
declare var require: any;
const { v4: uuidv4 } = require('uuid');

const GET_USER_TOBUY = gql`{
  vw_tobuys(order_by: {text: asc}) {
  id
  is_completed
  is_archived
  is_public
  group_id
  text
  selected_id
}
}`;

const TOBUY_POST = gql`
mutation insertToBuy($postId: String!, $text: String!) {
  insert_tobuy(objects: {id: $postId, text: $text}) {
    __typename
    returning {
      text
      id
    }
  }
}`;

const TOBUY_UP_COMPLETED = gql`
mutation updateCompletedToBuy($postId: String!, $isCompleted: Boolean!) {
  update_tobuy(where: {id: {_eq: $postId}}, _set: {is_completed: $isCompleted}) {
    __typename
    affected_rows
    returning {
      id
      is_completed
      __typename
    }
  }
}`;

const TOBUY_UP_DELETED = gql`
mutation updateArchivedToBuy($postId: String!, $isDeleted: Boolean!) {
  update_tobuy(where: {id: {_eq: $postId}}, _set: {is_archived: $isDeleted, is_completed: false}) {
    __typename
    affected_rows
    returning {
      id
      is_archived
      is_completed
      __typename
    }
  }
}`;

const TOBUY_UP_GROUP = gql`
mutation updateGroupToBuy($tobuyId: String!, $groupId: String!) {
  update_tobuy(where: {id: {_eq: $tobuyId}}, _set: {group_id: $groupId}) {
    __typename
    affected_rows
    returning {
      id
      group_id
      __typename
    }
  }
}`;

@Injectable({
  providedIn: 'root',
})
export class TobuyService {
  public SUBS_USER_TOBUY = gql`subscription{
    vw_tobuys(order_by: {text: asc}){
      id
      is_completed
      is_archived
      is_public
      group_id
      text 
      selected_id
    }
  }`;
  // TODO https://hasura.io/learn/graphql/angular-apollo
  // TODO https://auth0.com/blog/building-a-collaborative-todo-app-with-realtime-graphql-using-hasura/
  constructor(
    private apollo: Apollo
    ) {}

  watchUserTobuys(): QueryRef<unknown, EmptyObject> {
    return this.apollo.watchQuery({
      query: GET_USER_TOBUY,
      fetchPolicy: 'cache-first',
      //nextFetchPolicy: ,
    });
  }

  insertToBuy({ text }): Observable<FetchResult<unknown>> {
    const id = uuidv4();
    return this.apollo.mutate({
      mutation: TOBUY_POST,
      variables: { postId: id, text },
      optimisticResponse: {
        __typename: 'Post',
        insert_tobuy: {
          __typename: 'tobuy_mutation_response',
          affected_rows: 1,
          returning: { id, text, __tyname: 'tobuy' },
        },
      },
    });
  }

  updateComleted({ id, isCompleted }): Observable<FetchResult<unknown>> {
    return this.apollo.mutate({
      mutation: TOBUY_UP_COMPLETED,
      variables: { postId: id, isCompleted },
      optimisticResponse: {
        __typename: 'Post',
        update_tobuy: {
          __typename: 'tobuy_mutation_response',
          affected_rows: 1,
          returning: { id, is_completed: isCompleted, __typename: 'tobuy' },
        },
      },
    });
  }

  updateGroup({ id, groupId }): Observable<FetchResult<unknown>> {
    return this.apollo.mutate({
      mutation: TOBUY_UP_GROUP,
      variables: { tobuyId: id, groupId },
      optimisticResponse: {
        __typename: 'Post',
        update_tobuy: {
          __typename: 'tobuy_mutation_response',
          affected_rows: 1,
          returning: { id, group_id: groupId, __typename: 'tobuy' },
        },
      },
    });
  }

  updateDeleted({ id, isDeleted }): Observable<FetchResult<unknown>> {
    return this.apollo.mutate({
      mutation: TOBUY_UP_DELETED,
      variables: { postId: id, isDeleted },
      optimisticResponse: {
        __typename: 'Post',
        update_tobuy: {
          __typename: 'tobuy_mutation_response',
          affected_rows: 1,
          returning: { id, is_archived: isDeleted, is_completed: false, __typename: 'tobuy' },
        },
      },
    });
  }
}
