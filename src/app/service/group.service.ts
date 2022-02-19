import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { EmptyObject } from 'apollo-angular/types';
import { FetchResult } from '@apollo/client/core';

const GET_USER_GROUP_INFO = `{
  users {
    id
    name
    email
    is_group_granted
    group_id
    own_group {
      id
      name
      owner_id
      owner {
        email
        name
      }
      members_aggregate {
        aggregate {
          count
        }
      }
      members {
        id
        email
        name
        is_group_granted
      }
    }
    on_group {
      id
      name
      owner_id
      owner {
        email
        name
      }
      members_aggregate {
        aggregate {
          count
        }
      }
      members {
        id
        email
        name
        is_group_granted
      }
    }    
  }
}`;

const GET_GROUP_BY_OWNER_EMAIL = `
  groups(where: {owner: {email: {_eq: $email}}}, limit: 1) {
    id
    name
    owner {
      email
      name
    }
    members_aggregate {
      aggregate {
        count
      }
    }
  }`;

const UPDATE_USER_GROUP_ID = gql`
  mutation updateUserGroupId($groupId: String!, $userId: String!){
    update_users(where:{id: {_eq: $userId}}, _set:{group_id: $groupId, is_group_granted: false }) {
      __typename
      affected_rows
      returning {
        group_id
        is_group_granted
        __typename
      }
    }
  }`;

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private userWithGroup = new Subject();

  constructor(private apollo: Apollo) {}

  public getUserWithGroup(): Subject<any> {
    return this.userWithGroup;
  }

  public queryGroupOfOwnerEmail(email: string): QueryRef<unknown, EmptyObject> {
    return this.apollo.watchQuery({
      query: gql`query GetGroupOfOwnerEmail($email: String!)
    {
      ${GET_GROUP_BY_OWNER_EMAIL}
    }`,
      variables: { email },
      fetchPolicy: 'cache-and-network',
    });
  }

  public watchUserWithGroup(): QueryRef<unknown, EmptyObject> {
    return this.apollo.watchQuery({
      query: gql`
        ${GET_USER_GROUP_INFO}
      `,
      fetchPolicy: 'cache-first',
    });
  }

  public updateUserGroupId({
    groupId,
    userId,
  }): Observable<FetchResult<unknown>> {
    return this.apollo.mutate({
      mutation: UPDATE_USER_GROUP_ID,
      variables: { groupId, userId },
      optimisticResponse: {
        __typename: 'Post',
        update_users: {
          __typename: 'users_mutation_response',
          affected_rows: 1,
          returning: {
            id: userId,
            group_id: groupId,
            is_group_granted: false,
            __typename: 'users',
          },
        },
      },
    });
  }

  fetchUserWithGroup(): void {
    this.watchUserWithGroup().valueChanges.subscribe((user) => {
      this.userWithGroup.next(user);
    });

    this.watchUserWithGroup().subscribeToMore({
      document: gql`subscription 
        ${GET_USER_GROUP_INFO}
      `,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          this.userWithGroup.next(prev);
          return prev;
        }
        this.userWithGroup.next(subscriptionData);
        return subscriptionData.data;
      },
    });
  }
}
