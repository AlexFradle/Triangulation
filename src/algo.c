#include <stdio.h>

// https://www.learn-c.org/en/Linked_lists

typedef struct node {
    void *val;
    struct node *next;
} node_t;

void foreach(node_t **head, void (*func)(void *)) {
    node_t *current = *head;
    while (current != NULL) {
        (*func)(current->val);
        current = current->next;
    }
}

void prepend(node_t **head, void *val) {
    node_t *new_node;
    new_node = (node_t *) malloc(sizeof(node_t));
    new_node->val = val;
    new_node->next = *head;
    *head = new_node;
}

void push(node_t **head, void *val) {
    node_t *current = *head;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = (node_t *) malloc(sizeof(node_t));
    current->next->val = val;
    current->next->next = NULL;
}

void *dequeue(node_t **head) {
    void *retval = NULL;
    node_t *next_node = NULL;
    if (*head == NULL) {
        return NULL;
    }
    next_node = (*head)->next;
    retval = (*head)->val;
    free(*head);
    *head = next_node;

    return retval;
}

void *pop(node_t **head) {
    void *retval = NULL;
    if ((*head)->next == NULL) {
        retval = (*head)->val;
        free(*head);
        return retval;
    }
    node_t *current = *head;
    while (current->next->next != NULL) {
        current = current->next;
    }
    retval = current->next->val;
    free(current->next);
    current->next = NULL;
    return retval;
}

void *remove_by_index(node_t **head, int n) {
    void *retval = NULL;
    node_t *current = *head;
    node_t *temp_node = NULL;
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

void remove_by_value(node_t **head, void *value) {
    void *retval = NULL;
    node_t *current = *head;
    node_t *temp_node = NULL;
    while (current->next != NULL) {
        if (current->val == ) {

        }
    }
}

void print_int_node_val(void *v) {
    printf("%d\n", *(int *) v);
}

int main() {
    node_t *head  = NULL;
    head = (node_t *) malloc(sizeof(node_t));
    int first_val = 1;
    head->val = &first_val;
    head->next = NULL;
    int new_val = 2;
    push(head, &new_val);
    foreach(&head, &print_int_node_val);
    printf("%d\n", *(int *)pop(&head));
    return 0;
}
