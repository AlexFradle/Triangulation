#ifndef LINKED_LIST_H
#define LINKED_LIST_H

#include "maths.h"

typedef struct Node {
    Triangle *val;
    struct Node *next;
} Node;

void foreach(Node **head, void (*func)(Triangle *));
void prepend(Node **head, Triangle *val);
void push(Node **head, Triangle *val);
Triangle *dequeue(Node **head);
Triangle *pop(Node **head);
Triangle *remove_by_index(Node **head, int n);
Triangle *remove_by_value(Node **head, Triangle *val);
void delete_linked_list(Node *head);

#endif