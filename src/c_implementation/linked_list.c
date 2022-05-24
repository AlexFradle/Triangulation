//
// Created by Alw on 21/05/2022.
//

#include <stdio.h>
#include <stdlib.h>
#include "linked_list.h"

void foreach(Node **head, void (*func)(Triangle *)) {
    Node *current = *head;
    int index = 0;
    while (current != NULL) {
        printf("-----%d-----\n", index);
        (*func)(current->val);
        current = current->next;
        index++;
    }
}

void prepend(Node **head, Triangle *val) {
    Node *new_node = malloc(sizeof(Node));
    new_node->val = val;
    new_node->next = *head;
    *head = new_node;
}

void push(Node **head, Triangle *val) {
    Node *current = *head;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = malloc(sizeof(Node));
    current->next->val = val;
    current->next->next = NULL;
}

Triangle *dequeue(Node **head) {
    Triangle *retval = NULL;
    Node *next_node = NULL;
    if (*head == NULL) {
        return NULL;
    }
    next_node = (*head)->next;
    retval = (*head)->val;
    free(*head);
    *head = next_node;

    return retval;
}

Triangle *pop(Node **head) {
    Triangle *retval = NULL;
    if ((*head)->next == NULL) {
        retval = (*head)->val;
        free(*head);
        return retval;
    }
    Node *current = *head;
    while (current->next->next != NULL) {
        current = current->next;
    }
    retval = current->next->val;
    free(current->next);
    current->next = NULL;
    return retval;
}

Triangle *remove_by_index(Node **head, int n) {
    Triangle *retval = NULL;
    Node *current = *head;
    Node *temp_node = NULL;
    if (n == 0) {
        return dequeue(head);
    }
    for (int i = 0; i < n - 1; i++) {
        if (current->next == NULL) {
            return NULL;
        }
        current = current->next;
    }
    if (current->next == NULL) {
        return NULL;
    }
    temp_node = current->next;
    retval = temp_node->val;
    current->next = temp_node->next;
    free(temp_node);

    return retval;
}

Triangle *remove_by_value(Node **head, Triangle *val) {
    if (*head == NULL) {
        return NULL;
    }
    if ((*head)->val == val) {
        return dequeue(head);
    }

    Node *prev = *head;
    Node *cur = (*head)->next;
    while (cur) {
        if (compare_triangles(cur->val, val)) {
            prev->next = cur->next;
            free(cur);
            return val;
        }
        prev = cur;
        cur = cur->next;
    }
    return NULL;
}

void delete_linked_list(Node *head, bool free_val) {
    Node *cur = head;
    Node *next = head;
    while (cur != NULL) {
        next = cur->next;
        if (free_val) free(cur->val);
        free(cur);
        cur = next;
    }
}

bool some(Node **head, Triangle *comp_item, bool (*func)(Triangle *, Triangle *), bool exclude_comp_item) {
    Node *current = *head;
    while (current != NULL) {
        if (!(compare_triangles(comp_item, current->val) && exclude_comp_item)) {
            if (func(comp_item, current->val)) {
                return true;
            }
        }
        current = current->next;
    }
    return false;
}
